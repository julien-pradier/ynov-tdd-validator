import mysql.connector
from mysql.connector import IntegrityError
import os
from fastapi import FastAPI, Request, Header, HTTPException, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel

MY_SECRET = "secret"
ALGORITHM = "HS256"

class Login(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    firstName: Optional[str] = ""
    email: str
    birthDate: str

app = FastAPI()

# On récupère les origines depuis les variables d'environnement,
# avec localhost par défaut pour le développement et GitHub Actions.
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = cors_origins_str.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )

@app.get("/")
async def hello_world():
    return "Hello world"

@app.get("/users")
async def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM utilisateur")
        records = cursor.fetchall()

        utilisateurs = [
            {
                "id": r[0],
                "name": r[1],
                "firstName": r[2],
                "email": r[3],
                "birthDate": str(r[4]) if len(r) > 4 else None
            }
            for r in records
        ]
        return {'utilisateurs': utilisateurs}
    finally:
        cursor.close()
        conn.close()

@app.post("/users")
async def register_user(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Formatage de la date ISO ("2000-01-01T...") vers YYYY-MM-DD pour MySQL
        formatted_date = user.birthDate[:10]
        sql_insert = "INSERT INTO utilisateur (nom, prenom, email, date_naissance) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql_insert, (user.name, user.firstName, user.email, formatted_date))
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Utilisateur créé avec succès"}
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Cet email existe déjà.")
    finally:
        cursor.close()
        conn.close()

@app.post("/login")
async def login_user(login: Login):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        sql_select_Query = "SELECT * FROM admin WHERE email=%s AND password=%s"
        cursor.execute(sql_select_Query, (login.email, login.password))
        records = cursor.fetchall()

        if len(records) > 0:
            encoded_jwt = jwt.encode({'data': [{'email': login.email}]}, MY_SECRET, algorithm=ALGORITHM)
            return {"token": encoded_jwt}
        else:
            raise HTTPException(status_code=401, detail="Bad credentials")
    finally:
        cursor.close()
        conn.close()

@app.delete("/users")
async def deleteUser(id: int, authorization: Optional[str] = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]
    try:
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])

        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM utilisateur WHERE id=%s", (id,))
            conn.commit()
            deleted_count = cursor.rowcount

            if deleted_count == 0:
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

            return {"message": "Utilisateur supprimé avec succès"}
        finally:
            cursor.close()
            conn.close()

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Le jeton JWT a expiré")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Le jeton JWT est invalide")
