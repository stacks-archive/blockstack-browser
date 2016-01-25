import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import BookmarkListItem from '../components/BookmarkListItem'

function mapStateToProps(state) {
  return {
    bookmarks: state.settings.bookmarks
  }
}

class BookmarksPage extends Component {
  render() {
    return (
      <div>
        <h4 className="headspace inverse">Bookmarks</h4>
        <div style={{paddingBottom: '15px'}}>
          <ul className="list-group bookmarks-temp">
          { this.props.bookmarks.map(function(bookmark, index) {
            return (
              <BookmarkListItem
                key={index}
                profile={bookmark.profile}
                id={bookmark.id} />
            )
          })}
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(BookmarksPage)
