
# """
# Arithmetic Operators
# +    Addition	x + y
# -    Subtraction	x - y
# *    Multiplication	x * y
# /    Division	x / y
# %    Modulus	x % y
# **   Exponentiation	x ** y
# //   Floor division	x // y
# BODMAS Rule
# """


# """
# ASSIGNMENT OPERATORS
# = main assignment operator
# -= subtraction assignment operator
# += addition assignment operator
# *= multiplication assignment operator
# /= division assignment operator
# **= exponentiation assignment operator
# //= floor division assignment operator
# %= modulus assignment operator#



# """

# """

# COMPARISON OPERATORS
# ==    Equal	x == y
# !=    Not equal	x != y
# >     Greater than	x > y
# <     Less than	x < y
# >=    Greater than or equal to	x >= y
# <=    Less than or equal to	x <= y
# """nd


# Logical Operators

# X=2
# Y=20
# and 	Returns True if both statements are true	x < 5 and  Y < 10
# or Returns True if one of the statements is true	x < 5 or Y < 4
# not    Reverse the result, returns False if the result is true	not(x < 5 and Y < 10)

# """

# # age calculator 

# # hello user ur age is 52 and u
# # a =1998
# # b = 52

# # c= f"hello user i can see your age is {b} and u were born in {a} {20*10}"
# # print(c)



#Escape character illegal escape character in strings

# \" allows you to use a " in your string
# \\ 
# \n new line
# \t tab
# \b backspace
# \r carriage return
# x  ="hello\rworld "
# print(x)
# a = "hello world"
# print(len(a))
# print(a[0:5])#hello
# print(a[6:11])#world
# a = 14

# # a list is your mens of storiung multiple data forms in a single variable
# list1 = ["cherry","apple","orange","banana","kiwi","melon","mango","aapple","Apple","Mango"]

# list2 =list1.copy()

# print(list2) 

# fruits = ["apple","banana","cherry","kiwi","mango","hello"]

# print(fruits[0])
# print(fruits[-1])

# print(fruits)

# fruits[1] = "orange"

# print(fruits)


# string "" ''
# integer 10 12 13
# float 12.3 14.2 14.0
# boolean True False

# a = 4
# # varable assignment
# print(a)

# a = 5
# print(a)

# # variiable reasiment


# str(a ) #"5"
# int()
# float()
# bool()

# adds 2 numbers print out custom message        print("hello your answer is ")


# print("your answer ",5+6)

# f"your  answer is {5+6}"


# lis1 =["one","two","three"]

# print(lis1[0:2])

# tupels

# myTup = ("apple", "banana", "cherry","orange","kiwi","melon","mango","Apple","Mango")

# (i1,i2,*i3) = myTup
# len(myTup)


# print(myTup.index("kiwi"))










# a =20
# b=11

# #question 1
# x =a % b

# print(a)
# print(x)
# #question 2 taking val of x from q1
# a =x

# print(a)
# print(x)
# # a %=b

# list = [1,2,3,4,5,6,7,8,9,10]

# string="helloworld"


# for item in list:
#     if item % 2== 0:
#         print(item,"is divisible by 2")
#     else:
#         print(item,"is not divisible by 2")
# else:
#     print("finsihed")

# numbers = [4, 2, 6, 7, 3, 5, 8, 10, 6, 1, 9, 2]  
  
# # variable to store the square of the number  
# square = 0  
  
# # Creating an empty list  
# squares = []  
  
# # Creating a for loop  
# for value in numbers:  
#     square = value ** 2  
#     squares.append(square)  
# print("The list of squares is", squares)  


# counter = 0  
# # Initiating the loop  
# while counter < 10: 

# print("i ran")

# num =[1,2,3,]

# def function():
#     print("hello world")
    
# function()


# def add(a,b):
#     print(a+b)

# add(1,2)

# def name(name):
#     print("my name is",name)


# name("john")




# def greet():
#     print(1+2)
    
# greet()

# def add(a,b):
#     print(a+b)

# add(5)


# def abitry(a,b,*john):
#     print(john)
#     print(john[0])
    
# abitry(1,2,34,"hadha","adada")




# counter = 1
# while counter <= 100:
#     counter += 1
#     if counter%3 ==0 and counter %5 ==0:
#         print("fizzbuzz")
#     elif counter%5 ==0:
#         print("buzz")
#     elif counter%3 ==0:
#         print("fizz")
#     else:
#         print(counter)
# def sqr(num1):
#     return num1 * num1


# def rec(n):
#     if n==1:
#         print("triggered i stoped",1)
#     else:
#         print(n)
#         rec(n-1)

# rec(6)

# x = lambda a : a*2

# x(2)


# sqr = lambda a: a*a

# print(sqr(5))
# ab

# a=4
# b=3

# 4*3*2*1/3*2*


# tropic ={"helllo","hawia","etc"}
# mylist=[1,2,3,45,5]
# print(myset)

# myset.discard("set")


# del myset

# print(myset)

# remove("")
# discard("")
# pop()

# del

# set1 ={1,"two",3,} 
# set2 ={1,2,3,}

# set3=set1|set2#"one","two","three",1,2,3

# set3.symmetric_difference_update(set1)

# set1^set2

def factorial(n):
    initial = n
    multiple = 1  # Start with 1 for multiplication to work correctly
    while initial >= 1:
        multiple *= initial
        initial -= 1
    return multiple

def mainfunc(num):
    return factorial(num)/factorial(num-1)

print(mainfunc(4))
    
