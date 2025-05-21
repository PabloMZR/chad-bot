from app import db
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime


#Modelo de datos 
class User(db.Model):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()
    fecha_registro: Mapped[datetime] = mapped_column(default=datetime.utcnow)
   
    def _str_(self):
        return {
            f'id {self.id}',
            f'name {self.name}',
            f'email {self.email}',
            f'password {self.password}',
            f'fecha_registro {self.fecha_registro}'
        }
        
