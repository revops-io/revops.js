import React, { Component } from 'react'
import PropTypes from 'prop-types'

/** Color of error text, a valid color name or hex. */
export const errorColor = "red"

export const inputStyles = {
  background: 'hsla(0,0%,74%,.13)',
  borderRadius: '4px',
  padding: '8px',
  fontSize: '18px',
  lineHeight: '20px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all .15s ease-in-out 0s',
  border: '2px solid #F6F6F6',
  '&:focus': {
    background: 'white',
    border: '2px solid #c550ff'
  },
}

export const buttonStylesPrimary = {
  padding: '.6875em 1.1875em',
  transition: 'all .15s ease-in-out 0s',
  borderRadius: '4px',
  background: '#8800cc',
  color: '#ffffff',
  border: '1px solid #8800cc',
}

export const buttonStylesSecondary = {
  color: '#4c4a57',
  background: '#fff',
  border: '.0625em solid #c2c1c7',
  padding: '.6875em 1.1875em',
  transition: 'all .15s ease-in-out 0s',
  borderRadius: '4px',
}

export const buttonStylesTertiary = {
  padding: '.6875em 1.1875em',
  transition: 'all .15s ease-in-out 0s',
  borderRadius: '4px',
  color: '#4f34c7',
  border: 'none',
  background: 'none',
}

export const backgroundColor = {
  background: 'black',
}

export const cardWidth = {
  width: '404px',
  margin: '0 auto',
}

export const linkStyling = {
  color: '#4f34c7',
  display: 'block',
  margin: '1rem 0 2rem',
}
