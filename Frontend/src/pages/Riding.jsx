import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {
  return (
    <div className='h-screen'>
   <Link to='/home' className='right-2 top-2 fixed h-10 w-10 bg-white flex items-center justify-center rounded-full '>
     <i className='ri-home-5-line text-lg font-medium'></i>
   </Link>
        <div className='h-1/2 '>
            <img
          className="w-full h-full object-cover"
          src="https://imgs.search.brave.com/A9FGg0apJw5tFxYaTVZR3XNGO-SbZK-IiQwKcfRzWi8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzI4LzMwLzI2/LzM2MF9GXzcyODMw/MjYyMF9YZGRuZjVD/bDBLMUFDWnVyZDZ5/QnlVekhpSE1NSW9l/Ni5qcGc"
             />
        </div>
        <div className='h-1/2 p-4'>
         <div className='flex items-center justify-between'>
        <img src=" https://imgs.search.brave.com/jbkD8t3qexpL_IRFxMjNwnZXxCWMoIAeUDRRJx3hh3w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/OTQ2LzE5My9zbWFs/bC93aGl0ZS1tb2Rl/cm4tY2FyLWlzb2xh/dGVkLW9uLXRyYW5z/cGFyZW50LWJhY2tn/cm91bmQtM2QtcmVu/ZGVyaW5nLWlsbHVz/dHJhdGlvbi1mcmVl/LXBuZy5wbmc" 
        className='h-12'/>
        <div className='text-right'>
          <h2 className='text-lg font-medium'>Mishkat</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'>SYL-8943</h4>
          <p className='text-sm text-gray-600'>Allion, Toyota</p>
        </div>
      </div>
      
      <div className='flex flex-col gap-2 justify-between items-center'>
        
        <div
         className='w-full mt-5'>
            
             <div className='flex items-center gap-5 p-3 border-b-2  '> 
             <i className="ri-map-pin-2-fill text-lg"></i>
                
                <div>
            <h3 className='font-medium text-lg'>24B/AA-11</h3>
                <p className='text-sm text-gray-600 -mt-1'>Sylhet Stadium, Sylhet</p>
                </div>
            </div>
             <div className='flex items-center gap-5 p-3 '>
                <i className="ri-currency-line text-lg"></i>
                <div>
                 <h3 className='font-medium text-lg'>$20</h3>
                <p className='text-sm text-gray-600 -mt-1'>Cash</p>
                
                </div>
            </div>
         </div>
       
      </div>
        
            <button  className="w-full bg-green-600 text-white font-semibold mt-5 p-2 rounded-lg">Make A Payment</button>
        </div>
    </div>
  )
}

export default Riding