import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {

    const Navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({});

    const handleInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        })
    }
    console.log(inputData);

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (inputData.password !== inputData.confirmpassword) {
            setLoading(false)
            return toast.error("Password and Confirm Password must be same");
        }

        try {
            const Register = await axios.post(`/api/auth/register`, inputData);
            const data = Register.data;
            if (data.success === false) {
                setLoading(false);
                toast.error(data.message);
                console.log(data.message);
            }

            toast.success(data?.message);
            localStorage.setItem('chatapp', JSON.stringify(data))
            setAuthUser(data)
            setLoading(false);
            Navigate('/login');

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center max-w-full mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>

                <h1 className='text-3xl font-bold text-center text-gray-300'> Register <span>Chatters</span> </h1>

                <form onSubmit={handleSubmit} className='flex flex-col text-white'>

                    <div>
                        <label className='label p-2'> <span className='font-bold text-gray-950 text-xl label-text'>Fullname:</span> </label>
                        <input id='fullname' onChange={handleInput} type='text' placeholder='Enter Fullname' required className='w-full input input-bordered h-10' />

                    </div>

                    <div>
                        <label className='label p-2'> <span className='font-bold text-gray-950 text-xl label-text'>Username:</span> </label>
                        <input id='username' onChange={handleInput} type='text' placeholder='Enter Username' required className='w-full input input-bordered h-10' />

                    </div>

                    <div>
                        <label className='label p-2'> <span className='font-bold text-gray-950 text-xl label-text'>Email:</span> </label>
                        <input id='email' onChange={handleInput} type='email' placeholder='Enter Email' required className='w-full input input-bordered h-10' />
                    </div>

                    <div>
                        <label className='label p-2'> <span className='font-bold text-gray-950 text-xl label-text'>Password:</span> </label>
                        <input id='password' onChange={handleInput} type='password' placeholder='Enter Password' required className='w-full input input-bordered h-10' />

                    </div>

                    <div>
                        <label className='label p-2'> <span className='font-bold text-gray-950 text-xl label-text'>Confirm Password:</span> </label>
                        <input id='confirmpassword' onChange={handleInput} type='password' placeholder='Enter Confirm Password' required className='w-full input input-bordered h-10' />

                    </div>

                    <div id='gender' className='flex gap-2'>

                        <label className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-gray-950'>Male</span>
                            <input onChange={() => selectGender('male')} checked={inputData.gender === 'male'} type="checkbox" className="checkbox checkbox-success" />
                        </label>

                        <label className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-gray-950'>Female</span>
                            <input onChange={() => selectGender('female')} checked={inputData.gender === 'female'} type="checkbox" className="checkbox checkbox-success" />
                        </label>

                    </div>


                    <button type='submit' className='mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg hover:bg-gray-900 text-white rounded-lg hover:scale-105'> {loading ? "loading.." : "Register"}
                    </button>

                </form>

                <div className='pt-2'>
                    <p className='text-sm font-semibold text-gray-800'>

                        Already have an account?

                        <Link to={'/login'}>
                            <span className='text-white hover:underline'>Login Now!</span>
                        </Link>
                    </p>
                </div>


            </div>
        </div>
    )
}

export default Register