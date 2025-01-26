from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    coins = Column(Integer, default=0)
    level = Column(Integer, default=1)
    ref_link = Column(String, unique=True)
    invited_friends = Column(Integer, default=0)
    friends_usernames = Column(String)  # Хранение ников друзей через запятую
    profit_per_hour = Column(Float, default=0.0)
    profit_per_tap = Column(Float, default=1.0)

    def __repr__(self):
        return (f"<User(user_id={self.user_id}, username='{self.username}', coins={self.coins}, "
                f"level={self.level}, profit_per_hour={self.profit_per_hour}, "
                f"profit_per_tap={self.profit_per_tap})>")

# Настройка базы данных
DATABASE_URL = 'sqlite:///users.db'
engine = create_engine(DATABASE_URL, echo=True)  # Добавлен echo=True для логирования SQL-запросов
Base.metadata.create_all(engine)

# Создание сессии
Session = sessionmaker(bind=engine)
session = Session()

# Вспомогательная функция для отладки
if __name__ == "__main__":
    # Проверка базы данных
    print("Существующие пользователи:")
    users = session.query(User).all()
    for user in users:
        print(user)
