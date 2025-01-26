from models import session, User


def add_user(user_id, username, ref_link):
    user = User(user_id=user_id, username=username, ref_link=ref_link)
    session.add(user)
    session.commit()


def get_user(user_id):
    return session.query(User).filter_by(user_id=user_id).first()


def update_user_coins(user_id, coins):
    user = get_user(user_id)
    if user:
        user.coins = coins
        session.commit()


def update_profit_per_hour(user_id, profit):
    user = get_user(user_id)
    if user:
        user.profit_per_hour = profit
        session.commit()


def update_profit_per_tap(user_id, profit):
    user = get_user(user_id)
    if user:
        user.profit_per_tap = profit
        session.commit()
