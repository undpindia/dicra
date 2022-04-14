import React from 'react'
import { PropTypes } from 'prop-types'

const MenuButton = props => {
  const icon =
    props.icon === 'string' ? <i className={props.icon} /> : props.icon
  const active = props.id === props.selected && !props.collapsed ? ' active' : ''
  const disabled = props.disabled ? ' disabled' : ''

  const onClick = (e, id) => {
    if (!props.disabled){
      if (props.collapsed) {
        props.onOpen(e, id)
      } else {
        if (props.selected === id) {
          props.onClose(e)
        } else {
          props.onOpen(e, id)
        }
      } 
    }
  }

  return (
    <li className={active + disabled} key={props.id}>
      <button
        className="sidebar-tab-button"
        role='tab'
        onClick={e => onClick(e, props.id)}>{' '}{icon}
      </button>
    </li>
  )
}

MenuButton.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  disabled: PropTypes.bool,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  collapsed: PropTypes.bool
}

export default MenuButton
