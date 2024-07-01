import React, { useCallback, useEffect, useRef, useState } from 'react'
import PathItem from './PathItem'
import Modal from 'components/Modal'
import HttpApi from 'lib/HttpApi'
import styles from './PathChooser.css'
const api = new HttpApi('prefs/path')

interface PathChooserProps {
  isVisible: boolean
  onChoose(...args: unknown[]): unknown
  onCancel(...args: unknown[]): unknown
}

const PathChooser = (props: PathChooserProps) => {
  const { onCancel, onChoose, isVisible } = props
  const listRef = useRef<HTMLDivElement>()
  const checkboxRef = useRef<HTMLInputElement>()
  const [pathInfo, setPathInfo] = useState({
    current: null,
    parent: null,
    children: [],
  })

  const handleChoose = useCallback(() => {
    onChoose(pathInfo.current, { isWatchingEnabled: checkboxRef.current.checked })
  }, [onChoose, pathInfo])

  const ls = useCallback(dir => {
    api('GET', `/ls?dir=${encodeURIComponent(dir)}`)
      .then(res => setPathInfo(res))
      .catch(err => alert(err))
  }, [])

  // get initial list when chooser first becomes visible
  useEffect(() => {
    if (isVisible) ls(pathInfo.current ?? '.')
  }, [isVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  // scroll to top when changing dirs
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [])

  return (
    <Modal
      isVisible={isVisible}
      onClose={onCancel}
      title='Add Folder'
      style={{
        width: '90%',
        height: '95%',
      }}
    >
      <div className={styles.container}>
        <div className={styles.folderCurrent}>
          {pathInfo.current || '\u00a0'}
        </div>

        <div className={styles.folderList} ref={listRef}>
          {pathInfo.parent !== false &&
            <strong><PathItem path={'..'} onSelect={() => ls(pathInfo.parent)} /></strong>
          }

          {pathInfo.children.map((item, i) =>
            <PathItem key={i} path={item.label} onSelect={() => ls(item.path)} />
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.prefsContainer}>
            <label>
              <input type='checkbox' name='isWatchingEnabled' ref={checkboxRef} />
               &nbsp;Watch folder
            </label>
          </div>
          <div className={styles.btnContainer}>
            <button className='primary' onClick={handleChoose}>
              Add Folder
            </button>
            <button className='cancel' onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PathChooser
