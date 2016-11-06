import * as React from "react"
import { Dispatch } from "redux"
import { createAction, Action } from "redux-actions"
import { FlatButton, TextField } from "material-ui"
import {
  connect,
  disconnect,
} from "./action"
import { KiiUser, KiiPushMessage } from "kii-sdk"

type AppProps = {
  dispatch: Dispatch<Action<any>>,
  kiicloud: KiiCloudState,
  messages: MessagesState,
  members: MembersState,
  github_token: string,
  error: {
    rejected: Error,
  },
}

type LoginState = {
  username?: string,
  password?: string,
}

class Login extends React.Component<AppProps, LoginState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      username: "tmtk75",
      password: "abc123",
    }
  }
  render() {
    const { dispatch, kiicloud: { profile: { user } } } = this.props;
    return (
      <div>
        <TextField
          name="username"
          floatingLabelText="username"
          style={{width: '48%'}}
          value={this.state.username}
          onChange={(e: React.FormEvent<TextField>) => this.setState({username: (e.target as any).value})}
          />
        <TextField
          type="password"
          name="password"
          floatingLabelText="password"
          style={{width: '48%'}}
          value={this.state.password}
          onChange={(e: React.FormEvent<TextField>) => this.setState({password: (e.target as any).value})}
          />
        <FlatButton
          label="sign up"
          disabled={!!user}
          onClick={_ => dispatch(createAction("SIGN-UP")({
            username: this.state.username,
            password: this.state.password,
          }))}
          />
        <FlatButton
          label="sign in"
          disabled={!!user}
          onClick={_ => dispatch(createAction("SIGN-IN")({
            username: this.state.username,
            password: this.state.password,
          }))}
          />
        <FlatButton
          label="sign out"
          disabled={!user}
          onClick={_ => dispatch(createAction("SIGN-OUT")())}
          />
      </div>
    )
  }
}

class Connect extends React.Component<AppProps, {github_token: string}> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      github_token: props.github_token,
    }
  }
  render() {
    const { dispatch, kiicloud: { profile: { user, group }, mqtt: { client } } } = this.props;
    return (
      <div>
        <TextField
          name="github_token"
          floatingLabelText="github_token"
          fullWidth={true}
          value={this.state.github_token}
          onChange={(e: React.FormEvent<TextField>) => this.setState({github_token: (e.target as any).value})}
          />
        <FlatButton
          label="join"
          disabled={!user || !this.state.github_token}
          onClick={_ => dispatch(createAction("JOIN")({
            github_token: this.state.github_token,
          }))}
          />
        <FlatButton
          label="connect"
          disabled={!!client || !user || !group}
          onClick={_ => dispatch(connect(group))}
          />
        <FlatButton
          disabled={!client}
          label="disconnect"
          onClick={_ => dispatch(disconnect(this.props.kiicloud))}
          />
      </div>
    )
  }
}

class Message extends React.Component<AppProps, {status: string}> {
  constructor(props: AppProps) {
    super(props)
    this.state = {
      status: "",
    }
  }
  render() {
    const { dispatch, kiicloud: { profile: { user, group }, mqtt: { client } } } = this.props;
    return (
      <div>
        <TextField
          name="status"
          floatingLabelText="status"
          errorText={!!this.state.status && !client ? "not connected" : null}
          value={this.state.status}
          onChange={(e: React.FormEvent<TextField>) => this.setState({status: (e.target as any).value})}
          onKeyDown={e => e.keyCode === 13 ? this.sendMessage(e) : null}
          />
        <FlatButton
          label="send"
          disabled={!(client && user) || !this.state.status}
          onClick={this.sendMessage.bind(this)}
          />
      </div>
    )
  }
  sendMessage(e: React.FormEvent<TextField & FlatButton> | React.KeyboardEvent<{}>) {
    const { dispatch, kiicloud: { profile: { topic, group } } } = this.props;
    if (!topic) {
      return;
    }
    dispatch(createAction("SEND-MESSAGE")({group, topic, status: {message: this.state.status}}))
    this.setState({status: ""});
  }
}

class Member extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props)
  }
  render() {
    const { dispatch, kiicloud: { profile: { group, members } }, messages: { pushMessages } } = this.props;
    return (
      <div>
        <FlatButton
          label="load members"
          disabled={!group}
          onClick={_ => dispatch(createAction("LOAD-MEMBERS")(group))}
          />
        {group ? ` for ${group.getName()}` : null}
        <ul>{
          members.map(e =>
            <li key={e.getUUID()}>
              {e.getUsername()}: {pushMessages.get(e.getUUID())}
            </li>
          )
        }</ul>
      </div>
    )
  }
}

class Debug extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props);
  }
  render() {
    const {
      kiicloud: { profile: { user, group } },
      messages: {
        last,
        last: { value },
        pushMessages,
      },
      members,
      error: { rejected }
    } = this.props;

    return (
      <div>
        <div>user: {user ? user.getUsername() : null}</div>
        <div>group: {group ? group.getName() : null}</div>
        <div>last-message: {value ? value.toString() : null}</div>
        <div>error: {rejected ? rejected.message : null}</div>
      </div>
    )
  }
}

export default class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <div>
        <Login {...this.props}/>
        <Connect {...this.props}/>
        <Message {...this.props}/>
        <Member {...this.props}/>
        <hr />
        <Debug {...this.props}/>
      </div>
    )
  }
}
