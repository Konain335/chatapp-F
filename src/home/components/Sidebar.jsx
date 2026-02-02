import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5'
import { BiLogOut } from 'react-icons/bi'
import userConversation from '../../Zustans/useConversation'
import { useSocketContext } from '../../context/SocketContext' // ✅ path fix

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate()
    const { authUser, setAuthUser } = useAuth()

    const [searchInput, setSearchInput] = useState('')
    const [searchUser, setSearchuser] = useState([])
    const [chatUser, setChatUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

    const [newMessageUser, setNewMessageUser] = useState(null) // ✅ missing logic

    const { messages, selectedConversation, setSelectedConversation } = userConversation()
    const { onlineUsers, socket } = useSocketContext()

    // ================= ONLINE STATUS =================
    const nowOnline = chatUser.map(user => user._id)
    const isOnline = nowOnline.map(userId => onlineUsers.includes(userId)) // ✅ includes fix

    // ================= SOCKET NEW MESSAGE =================
    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setNewMessageUser(newMessage)
        })

        return () => socket?.off("newMessage")
    }, [socket, messages])

    // ================= CURRENT CHAT USERS =================
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data

                if (data?.success === false) {
                    console.log(data.message)
                } else {
                    setChatUser(data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        chatUserHandler()
    }, [])

    // ================= SEARCH =================
    const handleSearchSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`)
            const data = search.data

            if (!data || data.length === 0) {
                toast.info("No User Found")
                setSearchuser([])
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // ================= USER CLICK =================
    const handleUserClick = (user) => {
        onSelectUser(user)
        setSelectedUserId(user._id)
        setSelectedConversation(user)
        setNewMessageUser(null) // ✅ unread reset
    }

    // ================= BACK =================
    const handleSearchback = () => {
        setSearchuser([])
        setSearchInput('')
    }

    // ================= LOGOUT =================
    const handleLogOut = async () => {
        const confirmlogout = window.prompt("type 'UserName' To LOGOUT")
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data

                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                navigate('/login')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        } else {
            toast.info("LogOut Cancelled")
        }
    }

    return (
        <div className='h-full w-auto px-1'>

            {/* SEARCH */}
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit} className='w-auto flex items-center bg-white rounded-full'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='text-black px-4 bg-transparent outline-none rounded-full'
                        placeholder='Search User'
                    />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>
                </form>

                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-12 w-12 hover:scale-110 cursor-pointer'
                />
            </div>

            <div className='divider px-3'></div>

            {/* USERS LIST */}
            <div className='min-h-[70%] max-h-[80%] overflow-y-auto scrollbar'>
                {(searchUser.length > 0 ? searchUser : chatUser).map((user, index) => (
                    <div key={user._id}>
                        <div
                            onClick={() => handleUserClick(user)}
                            className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer 
                                ${selectedUserId === user._id ? 'bg-sky-500' : ''}`}
                        >

                            {/* ONLINE */}
                            <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                <div className='w-12 rounded-full'>
                                    <img src={user.profilepic} alt='user.img' />
                                </div>
                            </div>

                            <div className='flex flex-col flex-1'>
                                <p className='font-bold text-gray-950'>{user.username}</p>
                            </div>

                            {/* +1 NEW MESSAGE */}
                            {newMessageUser?.receiverId === authUser._id &&
                                newMessageUser?.senderId === user._id && (
                                    <div className="rounded-full bg-green-700 text-sm text-white px-[5px]">
                                        +1
                                    </div>
                                )}
                        </div>

                        <div className='divider px-3 h-[1px]'></div>
                    </div>
                ))}
            </div>

            {/* BACK */}
            {searchUser.length > 0 && (
                <div className='mt-auto px-1 py-1 flex'>
                    <button
                        onClick={handleSearchback}
                        className='bg-black rounded-full px-2 py-1'
                    >
                        <IoArrowBackSharp size={24} />
                    </button>
                </div>
            )}

            {/* LOGOUT */}
            {searchUser.length === 0 && (
                <div className='mt-auto px-1 py-1 flex items-center gap-2'>
                    <button onClick={handleLogOut}
                        className='hover:bg-red-600 w-10 hover:text-white rounded-lg'>
                        <BiLogOut size={25} />
                    </button>
                    <p className='text-sm'>Logout</p>
                </div>
            )}

        </div>
    )
}

export default Sidebar
