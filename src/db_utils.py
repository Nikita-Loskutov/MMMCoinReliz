from models import session, User

def add_user(user_id, username, ref_link):
    try:
        user = User(user_id=user_id, username=username, ref_link=ref_link)
        session.add(user)
        session.commit()
        print(f"User {username} added successfully.")
    except Exception as e:
        session.rollback()
        print(f"Error adding user {username}: {e}")


def get_user(user_id):
    try:
        return session.query(User).filter_by(user_id=user_id).first()
    except Exception as e:
        print(f"Error fetching user with user_id={user_id}: {e}")
        return None

def update_user_coins(user_id, coins):
    try:
        user = get_user(user_id)
        if user:
            user.coins = coins
            session.commit()
            print(f"User {user.username}'s coins updated to {coins}.")
        else:
            print(f"No user found with user_id={user_id}.")
    except Exception as e:
        session.rollback()
        print(f"Error updating coins for user {user_id}: {e}")

def update_profit_per_hour(user_id, profit):
    try:
        user = get_user(user_id)
        if user:
            user.profit_per_hour = profit
            session.commit()
            print(f"User {user.username}'s profit_per_hour updated to {profit}.")
        else:
            print(f"No user found with user_id={user_id}.")
    except Exception as e:
        session.rollback()
        print(f"Error updating profit_per_hour for user {user_id}: {e}")

def update_profit_per_tap(user_id, profit):
    try:
        user = get_user(user_id)
        if user:
            user.profit_per_tap = profit
            session.commit()
            print(f"User {user.username}'s profit_per_tap updated to {profit}.")
        else:
            print(f"No user found with user_id={user_id}.")
    except Exception as e:
        session.rollback()
        print(f"Error updating profit_per_tap for user {user_id}: {e}")

# Debugging Helper
if __name__ == "__main__":
    # Example usage
    user_id = 1
    username = "test_user"
    ref_link = "http://example.com/ref/1"

    # Add user
    add_user(user_id, username, ref_link)

    # Update coins
    update_user_coins(user_id, 100)

    # Fetch user and print
    user = get_user(user_id)
    if user:
        print(user)

    # Update profit
    update_profit_per_hour(user_id, 50.0)
    update_profit_per_tap(user_id, 2.5)
