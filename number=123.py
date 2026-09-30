num=1234
reversed=0
while num>0:
    remainder=num%10
    reversed=(reversed*10)+remainder
    num=num//10
print(reversed)    