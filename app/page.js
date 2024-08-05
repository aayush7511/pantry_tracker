'use client'

import { firestore } from "@/firebase";
import { Box, Button, Modal, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { deleteDoc, Firestore, setDoc, updateDoc } from "firebase/firestore";
import { collection} from "firebase/firestore";
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";
import React from "react";
import {useState} from "react"
import { query,doc,getDoc } from "firebase/firestore";
import { useSelectedLayoutSegment } from "next/navigation";


export default function Home() {

  const [inventory,setInventory] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [itemName, setItemName] = React.useState([''])
  const [searchVal, setSearchVal] = React.useState('')
  const [searchList, setSearchList] = React.useState(inventory)
  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore,'pantry'))
    const docs = await getDocs(snapshot)
    const itemList = []
    docs.forEach((doc)=>{
      itemList.push({
        name:doc.id,
      ...doc.data()
       })
    })
    setInventory(itemList)
    setSearchList(itemList)
  }
  useEffect(()=>{
    updateInventory()
  },[])
  
  
  const removeItem = async (item) =>{
    // getting a reference of the document
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)
    console.log(docSnap.data())

    if(docSnap.exists()){
      const {quantity} = docSnap.data()

      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }


  // helper functions 
  const addItem = async (item) =>{
    // getting a reference of the document
    const docRef = doc(collection(firestore,'pantry'), item)
    const docSnap = await getDoc(docRef)
    console.log(docSnap)
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      
      setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      setDoc(docRef, {quantity:1})
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = (searchValue) =>{
    
    if(searchValue.trim() === ""){setSearchList(inventory);console.log(searchList); return}
    const tempList = inventory.filter((item) => {

      if(item.name.toLowerCase().includes(searchValue.trim().toLowerCase())){
          return item
      }
      else{
          
          console.log("match not found")
        }
      })
    

    setSearchList(tempList)
    
  }
 
  return (
   <Box
      height="100vh"
      width="100vw"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={'center'}
      alignItems={'center'}
   >  
  
  <Box
  width='800px'
  height='100px'
  display={'flex'}
  flexDirection={'row'}
  justifyContent={'space-between'}
  alignItems={'center'}
  >

  
  <Button 
    variant='contained'
    onClick={()=>{
      handleOpen()
    }}

    sx={{
      mb:'5px'
    }}
    >Add new Item</Button>

  <Stack direction='row' spacing={2}>
    <TextField
    variant="outlined"
    fullWidth 
    value={searchVal}
    onChange={(e)=>{
      setSearchVal(e.target.value)
      console.log(`setting value of searchVal: ${searchVal}`)
      handleSearch(e.target.value)
    }}
    ></TextField>

    {/* <Button
    variant="outlined"
    onClick={() => {
      handleSearch()
    }}>
      Search
    </Button> */}
  </Stack>


  </Box>


  <Modal
  open={open}
  onClose={handleClose}
  >
   <Box
   position='absolute'
   top='50%'
   left='50%'
   width='600px'
   height='300px'
   backgroundColor='white'
   dropshadow={24}
   display='flex'
   flexDirection={'column'}
   alignItems='center'
   justifyContent={'center'}
   border='2px solid black'
   gap={2}
   sx={{
    transform:'translate(-50%,-50%)'
   }}
   >
    <Typography variant='h5'>Add Item</Typography>

    <Stack width={400} direction='row' spacing={2}>
        <TextField
        variant='outlined'
        fullWidth
        value={itemName}
        onChange={(e)=>{
          setItemName(e.target.value)
        }}></TextField>
      <Button variant="outlined" onClick={() =>{
        addItem(itemName)
        setItemName('')

      }}>Add</Button>
    </Stack>
  </Box>

  </Modal>

    <Box border={"1px solid grey"}>
    <Box
      width={"800px"}
      height={"100px"}
      textAlign={"center"}
      alignContent={"center"}
      backgroundColor={"#ADD8E6"}
      ><Typography
        variant="h2"
      >Inventory Management</Typography>
        

    </Box>
    <Stack
      direction={'column'}
      spacing={2}
      width={"800px"}
      height={"200px"}
      overflow={"auto"}
    >
      {searchList.map((i) =>(
        <Stack 
          key={i.name}
          width="100%"
          minHeight="150px"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={'center'}
          flexDirection={'row'}
          backgroundColor={"#dedede"}
          paddingX={'10px'}
          
          >
          <Typography
            variant={"h3"}
            color={"#474747"}
            textAlign={'center'}
          >{i.name.charAt(0).toLocaleUpperCase() + i.name.slice(1)}</Typography>

          <Stack
          display={'flex'}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={'row'}
          gap={3}>

          <Button
          variant="contained"
          onClick={()=>{
            removeItem(i.name)
          }
          }>Remove</Button>

          <Button
          variant="contained"
          onClick={()=>{
            addItem(i.name)
          }
          }>Add</Button>

          <Typography
            variant={"h3"}
            color={"#474747"}
            textAlign={'center'}
          >{i.quantity}</Typography>
          
          
          
          </Stack>
        </Stack>
        
      ))}
      
    </Stack>
    </Box>
   </Box> 
  )
}
