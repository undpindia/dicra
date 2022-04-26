import React from 'react'
import { PropTypes } from 'prop-types'

const Tab = props => {
  const active = props.active ? ' active' : ''
  const closeIcon = closeIconSelector(props)

  return (
    <div id={props.id} className={`sidebar-pane${active}`}>
      <h1 className='sidebar-header'>
        {props.header}
        <div
          className='sidebar-close'
          role='btn'
          onClick={props.onClose}
        >{closeIcon}
        </div>
      </h1>
      {props.children}
    </div>
  )
}

const closeIconSelector = props => {
  switch (typeof props.closeIcon) {
    case 'string':
      return <i className={props.closeIcon} />
    case 'object':
      return props.closeIcon
    default:
      return props.position === 'right' ? (
        <i className='fa fa-caret-right' />
      ) : (
        <i className='fa fa-caret-left' />
      )
  }
}

closeIconSelector.propTypes = {
  closeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  position: PropTypes.oneOf(['left', 'right'])
}

Tab.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.element, 
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  onClose: PropTypes.func,
  active: PropTypes.bool
}

export default Tab
