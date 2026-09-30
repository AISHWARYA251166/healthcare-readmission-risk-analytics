arr=[0,1,0,3,12]
j=0
for i in range(len(arr)):
    if arr[i]!=0:
        arr[j],arr[i]=arr[i],arr[j]
        j+=1
print(arr)