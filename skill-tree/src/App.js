import React from 'react';
import map from 'lodash/map';
import './App.scss';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.handleContext = this.handleContext.bind(this);

		//Ideally, the talentPaths would be pulled from a database instead of hard-coded.
		this.state = {
			currentPoints: 0,
			totalPoints: 6,
			talentPaths: {
				path1: {
					id: 'path1',
					name: 'Talent Path 1',
					talents: {
						1: {
							id: 1,
							icon: 'stack',
							enabled: false,
							prev: null,
							post: 2,
						},
						2: {
							id: 2,
							icon: 'silverware',
							enabled: false,
							prev: 1,
							post: 3,
						},
						3: {
							id: 3,
							icon: 'cake',
							enabled: false,
							prev: 2,
							post: 4,
						},
						4: {
							id: 4,
							icon: 'crown',
							enabled: false,
							prev: 3,
							post: null,
						}
					}
				},
				path2: {
					id: 'path2',
					name: 'Talent Path 2',
					talents: {
						5: {
							id: 5,
							icon: 'boatmaybeidk',
							enabled: false,
							prev: null,
							post: 6,
						},
						6: {
							id: 6,
							icon: 'snorkel',
							enabled: false,
							prev: 5,
							post: 7,
						},
						7: {
							id: 7,
							icon: 'lightning',
							enabled: false,
							prev: 6,
							post: 8,
						},
						8: {
							id: 8,
							icon: 'skull',
							enabled: false,
							prev: 7,
							post: null,
						}
					}
				},
			}
		};
	}

	/**
	 * Handle selecting a talent via left-click.
	 * @param string pathId The name/id of the current path.
	 * @param integer talentId The id of the selected talent.
	 */
	handleClick(pathId, talentId) {
		if (this.state.currentPoints < this.state.totalPoints) {
			let talent = this.state.talentPaths[pathId].talents[talentId];

			if (talent.enabled) {
				//We've already enabled this, so ignore the click.
				return;
			}

			if (talent.prev) {
				//Check that the pre-requisite is enabled.
				let prevTalent = this.state.talentPaths[pathId].talents[talent.prev];
				if (!prevTalent.enabled) {
					//We haven't enabled the pre-requisite in the talent path.
					alert('You must select the previous talent before choosing this one.');
					return;
				}
			}

			//We have enough points and have enabled the pre-requisite, so we can enable this talent.
			let points = this.state.currentPoints;
			this.setState(prevState => {
				let newState = prevState;
				newState.talentPaths[pathId].talents[talentId].enabled = true;
				newState.currentPoints = points + 1;
				return newState;
			});
		} else {
			alert('You are out of points to spend.');
		}
	}

	/**
	 * Handle deselecting a talent via right-click.
	 * @param string pathId The name/id of the current path.
	 * @param integer talentId The id of the selected talent.
	 */
	handleContext(pathId, talentId) {
		if (this.state.currentPoints > 0) {
			let talent = this.state.talentPaths[pathId].talents[talentId];

			if (!talent.enabled) {
				//We've already disabled this, so ignore the click.
				return;
			}

			if (talent.post) {
				//Check that the following talent isn't enabled.
				let postTalent = this.state.talentPaths[pathId].talents[talent.post];
				if (postTalent.enabled) {
					//We haven't disabled the following talent in the path.
					alert('You must deselect the following talent before removing this one.');
					return;
				}
			}

			//We have enough points and have diabled the following talent, so we can disable this talent.
			let points = this.state.currentPoints;
			this.setState(prevState => {
				let newState = prevState;
				newState.talentPaths[pathId].talents[talentId].enabled = false;
				newState.currentPoints = points - 1;
				return newState;
			});
		} else {
			alert('You haven\'t spent any points yet.');
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					TitanStar Legends - Rune Mastery Loadout Talent Calculator 3000
				</header>
				<div className="points">
					<span className="current-points">{`${this.state.currentPoints} / ${this.state.totalPoints}`}</span>
					<span className="points-label">Points Spent</span>
				</div>
				<div className="paths">
					{map(this.state.talentPaths, path => {
						return (
							<table key={path.id} cellPadding="0" cellSpacing="0">
								<tbody>
									<tr>
										<td className="path-name">{path.name}</td>
										{map(path.talents, talent => {
											return (
												<>
													{talent.prev ? (
														<td key={`${talent.id}-bar`} className="icon-spacer">
															<div className={`bar ${path.talents[talent.prev].enabled ? 'on' : 'off'}`}></div>
														</td>
													) : null}
													<td
														key={talent.id}
														className={`icon ${talent.icon} ${talent.enabled ? 'on' : 'off'}`}
														onClick={() => this.handleClick(path.id, talent.id)}
														onContextMenu={(e) => {
															this.handleContext(path.id, talent.id);
															e.preventDefault();
															return false;
														}}
														title={'some hover text'}
													></td>
												</>
											)
										})}
									</tr>
								</tbody>
							</table>
						);
					})}
				</div>
			</div>
		);
	}
}

export default App;
