
# Dette er en Python klasse der repræsentere en bruger
class User:

    #__init__ er en "constructor"
    # Den bliver kørt når vi oprettter en ny bruger
    def __init(self, user_id, username):

        # gem brugerens id
        self.user_id = user_id

        # gem brugerens navn
        self.username = username
    

# Denne klasse ræpresenterer en gruppe
class Group:

    def __init__(self, group_id, group_name, creator_id):

        # unikt id for gruppen
        self.group_id = group_id

        # gruppens navn
        self.group_name = group_name

        # hvem der oprettede gruppen
        self.creator_id = creator_id

        # liste over medlemmer i gruppen
        self.members = []

        # hvem er admin
        self.admin = creator_id


# Dette er vores "server"
# Den styrer brugere og grupper
class ChatServer:

    def __init__(self):
        
        # database over brugere
        self.users = {}

        # database over grupper
        self.groups = {}

        # tæller til at give nye id'er
        self.next_group_id = 1


# funktion til at oprette en ny gruppe

