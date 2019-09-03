import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled, { ThemeProvider } from 'styled-components';
import { IAppState } from '../../background/store';
import GlobalStyle from '../../components/styles/GlobalStyle';
import { themes, ThemeTypes } from '../../components/styles/themes';
import Counter from '../../containers/Counter';

interface IOptionsApp {
	theme: ThemeTypes;
	dispatch: Dispatch;
}

class OptionsApp extends React.Component<IOptionsApp> {

	render() {
		return (
			<ThemeProvider theme={themes[this.props.theme]}>
				<React.Fragment>
					<GlobalStyle />
					<OptionsAppContainer>
						<Counter/>
					</OptionsAppContainer>
				</React.Fragment>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	return {
		theme: state.settings.theme
	};
};

export default connect(mapStateToProps)(OptionsApp);

const OptionsAppContainer = styled('div')`
	position: absolute;
	display: flex;
	flex-direction: row;
	justify-content: center;
	justify-items: center;
	align-items: center;
	height: 90vh;
	width: 90vw;
	left: 5vw;
	top: 5vh;
	background-color: ${p => p.theme.backgroundColor};
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;
