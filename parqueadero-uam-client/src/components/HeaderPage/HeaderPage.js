import React from 'react'
import Logo from "../../assets/png/logo.png";

export const HeaderPage = () => {
  return (
    <header className='header'>
      <div className='header-container'>
        <img className="header-container__left__logo" src={Logo} alt="Logo"/>
      </div>
    </header>
  )
}

