import bcrypt #to get the library

password = input("Enter password:") # write a password
password_bytes=password.encode('utf-8')#convert from string to bytes
salt = bcrypt.gensalt() # generate random salt
hashed_password = bcrypt.hashpw(password_bytes, salt)#where the hash happens
print("Your hashed password is:")
print(hashed_password)

# If you want to run this program open the terminal and write this: python password_hash.py