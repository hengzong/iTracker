import "./Bookmarks.scss";

import {
  BOOKMARK_FOLDER_DELETE,
  BOOKMARK_FOLDER_POST,
  BOOKMARK_FOLDER_PUT,
  BOOKMARK_USERID_GET
} from "../api";
import { Collapse, Icon, Input, List, Modal } from "antd";
import React, { Component } from "react";

import BackgroundContainer from "../background";
import { Header } from "../header";
import { Link } from "react-router-dom";
import { Button as MButton } from "@material-ui/core";
import { Redirect } from "react-router";
import axios from "axios";
import logo from "../image/logo.png";

const { TextArea } = Input;

class Bookmarks extends Component {
  state = {
    user: null,
    bookmarkList: [],
    deleteVisible: false,
    editVisible: false,
    addVisible: false
  };

  componentWillMount() {
    let user = localStorage.getItem("user");
    let token = localStorage.getItem("token");
    if (user && token) {
      console.log(user, token);
      user = JSON.parse(user);
      this.setState({
        user,
        token
      }, () => this._updateFolderList());
    }
  }

  _updateFolderList = () => {
    const {token, user} = this.state;

    axios
      .get(BOOKMARK_USERID_GET, {
        params: {
          userID: user._id,
          token
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          bookmarkList: res.data.data
        });
      })
      .catch(e => {
        console.log(e.response);
      });
  };

  _renderUrls = urls => {
    const Item = List.Item;

    return (
      <List
        bordered
        dataSource={urls}
        renderItem={item => (
          <Item>
            <Link to={`/?browseURL=${item}`}>{item}</Link>
          </Item>
        )}
      />
    );
  };

  _renderFolderButtons = folder => {
    return (
      <div className="folderButtons">
        <Icon
          type="edit"
          style={{ marginRight: 10 }}
          onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
            this.setState(
              {
                currentFolderID: folder._id,
                currentFolderName: folder.name,
                currentFolderUrls: folder.urlList.join("\n")
              },
              () => {
                this.showEditModal();
              }
            );
          }}
        />
        <Icon
          type="delete"
          onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
            this.setState(
              {
                currentFolderID: folder._id
              },
              () => {
                this.showDeleteModal();
              }
            );
          }}
        />
      </div>
    );
  };

  _renderAddButton = () => (
    <MButton
      variant="outlined"
      size="medium"
      color="primary"
      onClick={this.showAddModal}
      id="addButton"
    >
      Add
    </MButton>
  );

  showAddModal = () => {
    this.setState({
      addVisible: true
    });
  };

  handleAdd = e => {
    this._addFolder();
    this.setState({
      addVisible: false
    });
  };

  handleCancelAdd = e => {
    this.setState({
      addVisible: false
    });
  };

  _addFolder = () => {
    const { currentFolderName, currentFolderUrls, user, token } = this.state;
    axios
      .post(BOOKMARK_FOLDER_POST, {
        name: currentFolderName,
        urlList: currentFolderUrls.split("\n"),
        assignedUser: user._id,
        token
      })
      .then(res => {
        console.log(res.data);
        this._updateFolderList();
      })
      .catch(e => {
        console.log(e.response);
      });
  };

  showDeleteModal = () => {
    this.setState({
      deleteVisible: true
    });
  };

  handleDelete = e => {
    this._deleteFolder(this.state.currentFolderID);
    this.setState({
      deleteVisible: false
    });
  };

  handleCancelDelete = e => {
    this.setState({
      deleteVisible: false
    });
  };

  showEditModal = () => {
    this.setState({
      editVisible: true
    });
  };

  handleEdit = e => {
    this._editFolder();
    this.setState({
      editVisible: false
    });
  };

  handleCancelEdit = e => {
    this.setState({
      editVisible: false
    });
  };

  _editFolder = () => {
    const {
      currentFolderID,
      currentFolderName,
      currentFolderUrls,
      token
    } = this.state;
    axios
      .put(`${BOOKMARK_FOLDER_PUT}/${currentFolderID}`, {
        name: currentFolderName,
        urlList: currentFolderUrls.split("\n"),
        token
      })
      .then(res => {
        console.log(res.data);
        this._updateFolderList();
      })
      .catch(e => {
        console.log(e.response);
      });
  };

  folderNameChange = e => {
    this.setState({
      currentFolderName: e.target.value
    });
  };

  folderListChange = e => {
    this.setState({
      currentFolderUrls: e.target.value
    });
  };

  _deleteFolder = folderID => {
    const { token } = this.state;
    axios
      .delete(`${BOOKMARK_FOLDER_DELETE}/${folderID}`, {
        params: { token }
      })
      .then(res => {
        console.log(res.data);
        this._updateFolderList();
      })
      .catch(e => {
        console.log(e.response);
      });
  };

  _renderCollapse = () => {
    const { bookmarkList } = this.state;
    const Panel = Collapse.Panel;

    return (
      <Collapse bordered={false} className="folderList">
        {bookmarkList.map((folder, index) => {
          return (
            <Panel
              header={folder.name}
              key={index.toString()}
              extra={this._renderFolderButtons(folder)}
              className="folderPanel"
            >
              {this._renderUrls(folder.urlList)}
            </Panel>
          );
        })}
      </Collapse>
    );
  };

  _renderLogoutButton = () => (
    <Link to="/" className="logoutButton">
      <MButton
        variant="outlined"
        size="medium"
        color="primary"
        onClick={() => window.localStorage.clear()}
        id="logoutButton"
      >
        Logout
      </MButton>
    </Link>
  );

  render() {
    const {
      user,
      deleteVisible,
      editVisible,
      addVisible,
      currentFolderName,
      currentFolderUrls
    } = this.state;

    if (!user) {
      return <Redirect to="/login" />;
    }

    return (
      <BackgroundContainer style={{ height: "100vh" }}>
        <Header displayText={user.name} buttonText="Return" buttonLink="/" />
        <div className="contentContainer">
          <img src={logo} alt="logo" />
          <h1 className="bookmarkTitle">Bookmarks</h1>
          <div className="foldersContainer">
            {this._renderAddButton()}
            {this._renderCollapse()}
          </div>
          {this._renderLogoutButton()}
        </div>
        <Modal
          title="Delete Folder"
          visible={deleteVisible}
          onOk={this.handleDelete}
          onCancel={this.handleCancelDelete}
        >
          <p>Are you sure?</p>
        </Modal>
        <Modal
          title="Edit Folder"
          visible={editVisible}
          onOk={this.handleEdit}
          onCancel={this.handleCancelEdit}
        >
          <h3>Folder Name</h3>
          <Input
            placeholder="My favourite"
            onChange={this.folderNameChange}
            value={currentFolderName || ""}
            className="inputLine"
          />
          <h3>URLs (split in lines)</h3>
          <TextArea
            placeholder="https://google.com/?igu=1"
            onChange={this.folderListChange}
            value={currentFolderUrls || ""}
            autosize={{ minRows: 2 }}
          />
        </Modal>
        <Modal
          title="Add Folder"
          visible={addVisible}
          onOk={this.handleAdd}
          onCancel={this.handleCancelAdd}
        >
          <h3>Folder Name</h3>
          <Input
            placeholder="My favourite"
            onChange={this.folderNameChange}
            value={currentFolderName || ""}
            className="inputLine"
          />
          <h3>URLs (split in lines)</h3>
          <TextArea
            placeholder="https://google.com/?igu=1"
            onChange={this.folderListChange}
            value={currentFolderUrls || ""}
            autosize={{ minRows: 2 }}
          />
        </Modal>
      </BackgroundContainer>
    );
  }
}

export default Bookmarks;
