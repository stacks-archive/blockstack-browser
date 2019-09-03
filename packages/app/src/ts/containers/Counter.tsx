import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import { IAppState } from '../background/store';
import { decrement, increment } from '../background/store/counter/actions';
import { ICounter } from '../background/store/counter/reducer';

interface ICounterProps {
	counter: ICounter;
	dispatch: Dispatch;
}

class Counter extends React.Component<ICounterProps> {
	increment = () => {
		this.props.dispatch(increment());
	}
	decrement = () => {
		this.props.dispatch(decrement());
	}

	render() {
		return (
			<CounterContainer >
				<Display>
					{this.props.counter.clicksMade}
				</Display>
				<Controls>
					<Button onClick={this.increment}>+</Button>
					<Button onClick={this.decrement}>-</Button>
				</Controls>
			</CounterContainer>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	return {
		counter: state.counter,
	};
};

export default connect(mapStateToProps)(Counter);

const CounterContainer = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	min-width: 100px;
	padding: 5px;
	margin: 5px;
	background-color: ${p => p.theme.backgroundColor};
`;

const Display = styled('div')`
	font-size: 48px;
	justify-self: center;
`;

const Controls = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	min-width: 200px;
`;

// Thanks to: https://codepen.io/FelipeMarcos/pen/tfhEg?editors=1100
const Button = styled('button')`
	display: inline-block;
	position: relative;
	padding: 10px 30px;
	border: 1px solid transparent;
	border-bottom: 4px solid rgba(0,0,0,0.21);
	border-radius: 4px;
	background: linear-gradient(rgba(27,188,194,1) 0%, rgba(24,163,168,1) 100%);

	color: white;
	font-size: 22px;
	text-shadow: 0 1px 0 rgba(0,0,0,0.15);
	text-decoration: none;

	cursor: pointer;
	outline: none;
	user-select: none;

	&:active {
		background: #169499;
	}
`;
