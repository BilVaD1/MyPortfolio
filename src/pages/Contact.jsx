import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import Alert from '@mui/material/Alert';

import { useStateContext } from '../contexts/ContextProvider'
import { LinkedinIcon, Insta } from '../components';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);

  const { setMouseHeight, setMouseWidth, setMouseColor, setMouseTop } = useStateContext();

  const form = useRef()

  const sendEmail = (e) => {
    e.preventDefault()

    emailjs.sendForm(
      "service_86qwvvd",
      "template_28nzdyw",
      form.current,
      "aZgtnf24mJ8fSRHdo"
    ).then(
      result => console.log(result.text),
      error => console.log(error.text)
    )

    e.target.reset()
    // alert(`Thank you, ${name}! Your message has been sent.`);
    setDisplayAlert(true)
    setEmail('')
    setName('')
    setMessage('')
    setTimeout(() => setDisplayAlert(false), 5000)
  }


  return (
    <div className="p-4 pt-[100px] text-center h-screen">
      <h1 className="text-3xl 
        font-bold 
        mb-10 
        bg-gradient-to-l 
        hover:bg-gradient-to-r 
        from-indigo-500 
        via-purple-500 
        to-pink-500 
        duration-1000
        bg-clip-text 
        animate-pulse
        text-fill-transparent">Contact Me</h1>
      <form ref={form} onSubmit={sendEmail} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1 dark:text-gray-300 text-left cursor-none">
            Name
          </label>
          <input
            type="text"
            id="name"
            name='user_name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border-gray-800 bg-slate-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-none"
            required
            onMouseOver={() => {setMouseHeight('30px'); setMouseWidth('2px'); setMouseColor('rgba(67, 39, 245, 1)'); setMouseTop(-10)}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)'); setMouseTop(-5)}}  
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1 dark:text-gray-300 text-left cursor-none">
            Email
          </label>
          <input
            type="email"
            id="email"
            name='user_email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border-gray-300 bg-slate-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-none"
            required
            onMouseOver={() => {setMouseHeight('30px'); setMouseWidth('2px'); setMouseColor('rgba(67, 39, 245, 1)'); setMouseTop(-10)}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)'); setMouseTop(-5)}} 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block font-medium mb-1 dark:text-gray-300 text-left cursor-none">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows="5"
            name='message'
            className="w-full border-gray-300 bg-slate-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-none"
            required
            onMouseOver={() => {setMouseHeight('30px'); setMouseWidth('2px'); setMouseColor('rgba(67, 39, 245, 1)'); setMouseTop(-10)}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)'); setMouseTop(-5)}} 
          ></textarea>
        </div>
        <div className="text-center mt-[40px]">
          <button
            type="submit"
            className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-indigo-500 hover:bg-indigo-700 border-2 border-indigo-500 
            hover:border-indigo-700 duration-500 cursor-none"
            onMouseOver={() => {setMouseHeight('15px'); setMouseWidth('15px'); setMouseColor('rgba(225, 39, 245, 1)')}}
            onMouseLeave={() => {setMouseHeight('35px'); setMouseWidth('35px'); setMouseColor('rgba(0, 0, 0, 0.5)')}} 
          >
            Send Message
          </button>
        </div>
      </form>
      <div className='text-6xl dark:text-white flex gap-6 justify-center mt-[50px]'>
            <LinkedinIcon />
            <Insta />
      </div>
      <div className='dark:text-white mt-[15px]'>bilvad1@gmail.com</div>
      {displayAlert ? <MyAlert /> : ''}
    </div>
  );
}

export default Contact;


const MyAlert = ({Name}) => {
  return (
    <div className='relative mt-[50px] w-[500px] ml-auto mr-auto'>
      <Alert severity="success">Thank you, {Name} Your message has been sent.</Alert>
    </div>
  )
}