// @flow
import React from 'react'
import Navbar from './components/Navbar'

const HomeScreenPage = () =>
(
  <div>
    <Navbar
      hideBackToHomeLink
      activeTab="home"
    />
    <div className="home-screen">
      <div className="container-fluid app-center">
        <div className="container app-wrap">
          <div className="app-container no-padding">
            <div className="container-fluid app-box-wrap">
              <a
                href="http://blockstack-todos.appartisan.com/"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-todo-list@2x.png"
                    alt="To Do List"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>To Do List</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="http://www.guildblog.com/"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-guild@2x.png"
                    alt="Guild"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Guild</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="http://ongakuryoho.com"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-ongaku-ryoho@2x.png"
                    alt="Ongaku Ryoho"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Ongaku Ryoho</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="https://helloblockstack.com"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-hello-blockstack@2x.png"
                    alt="Hello, Blockstack"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Hello, Blockstack</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="https://forum.blockstack.org"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-forum@2x.png"
                    alt="Forum"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Forum</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="https://casa.cash"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-casa@2x.png"
                    alt="Casa"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Casa</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="https://www.openbazaar.org"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-openbazaar@2x.png"
                    alt="OpenBazaar"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>OpenBazaar</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="https://ntzwrk.org/projects/beacon/"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-beacon@2x.png"
                    alt="Beacon"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Beacon</h3>
              </div>
            </div>
            <div className="container-fluid app-box-wrap">
              <a
                href="http://www.afiabeta.com/"
                className="app-box-container"
              >
                <div className="app-box">
                  <img
                    src="/images/app-icon-afia@2x.png"
                    alt="Afia"
                  />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Afia</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default HomeScreenPage
