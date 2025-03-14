import React, { useState } from 'react'
import { HRregister } from './HRRegister';
import OTPverification from './OTPverification';

const HrRegistration = () => {
    
  return (
    <>
      {
        step==1 && ( <HRregister/>)
      }
      {
        step===2 && (<OTPverification/>)
      }
    </>
  )
}

export default HrRegistration
