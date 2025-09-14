import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl, clearCart } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async() =>{
         try {
            if (!token) {
                console.log('❌ No token found for payment verification');
                return null
            }

            console.log('🔍 Verifying payment:', { success, orderId });
            const response = await axios.post(backendUrl + '/api/order/verifyStripe',{success,orderId}, {headers:{token}})
            console.log('📝 Payment verification response:', response.data);

            if (response.data.success) {
                console.log('✅ Payment verified successfully, clearing cart');
                clearCart()
                navigate('/orders')
            }else{
                console.log('❌ Payment verification failed');
                navigate('/cart')
            }
         } catch (error) {
            console.log('💥 Payment verification error:', error)
            toast.error(error.message)
         }
    }

    useEffect(()=>{
        verifyPayment()
    }, [token])

  return (
    <div>
      
    </div>
  )
}

export default Verify
