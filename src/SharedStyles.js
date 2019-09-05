import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const inputStyles = {
  background: 'hsla(0,0%,74%,.13)',
  borderRadius: '4px',
  padding: '8px',
  fontSize: '18px',
  lineHeight: '20px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all .15s ease-in-out 0s',
  '&:focus': {
    background: 'white',
    border: '2px solid #c550ff'
  },
}
export const buttonStylesPrimary = {
  // Styling for primary button
  // is there a way to get shared styling across all the buttons?
  // shared
    padding: '.6875em 1.1875em',
    transition: 'all .15s ease-in-out 0s',
    borderRadius: '4px',
  // end of shared
  background: '#80c',
  border: '1px solid #80c',
  color: '#fff',
  '&:hover': {
    background: '#a0f',
    border: '1px solid #a0f',
    transform: 'translateY(-1px)'
  },
}
export const buttonStylesSecondary = {
  // Styling for secondary button
  // shared
    padding: '.6875em 1.1875em',
    transition: 'all .15s ease-in-out 0s',
    borderRadius: '4px',
  // end of shared
  color: '#4c4a57',
  background: '#fff',
  border: '.0625em solid #c2c1c7',
  '&:hover': {
    boxShadow: '0 1px 4px rgba(27,26,33,.25)',
    transform: 'translateY(-1px)',
    filter: 'brightness(1.1)'
  },
  '&:focus': {
    boxShadow: '0 1px 4px rgba(27,26,33,.25)',
    transform: 'translateY(-1px)',
    filter: 'brightness(1.1)'
  },
}
export const buttonStylesTertiary = {
  // shared
    padding: '.6875em 1.1875em',
    transition: 'all .15s ease-in-out 0s',
    borderRadius: '4px',
  color: '#4f34c7',
  border: 'none',
  background: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}
export const backgroundColor = {
  background: 'black',
}
