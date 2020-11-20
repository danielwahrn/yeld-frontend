import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextField, Button, Typography, Modal } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { colors } from '../../theme'

import { CONNECTION_CONNECTED, CONNECTION_DISCONNECTED } from '../../constants'

import UnlockModal from '../unlock/unlockModal.jsx'

import Store from '../../stores'
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
	root: {
		verticalAlign: 'top',
		width: '100%',
    display: 'flex',
    border: '1px solid #e1e3e6',
		[theme.breakpoints.down('sm')]: {
			marginBottom: '40px',
		},
	},
	headerV2: {
		background: colors.white,
		borderTop: 'none',
		display: 'flex',
		padding: '24px 32px',
		alignItems: 'center',
		justifyContent: 'center',
		width: '391px',
  },
	account: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		width: 'calc(100% - 400px)',
		marginRight: '20px',
		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			flexDirection: 'column-reverse',
			position: 'absolute',
			top: '130px',
			left: '50%',
			transform: 'translateX(-50%)',
			width: '100%',
			border: '1px solid #e1e3e6',
    	padding: '10px',
		},
	},
	versionsContainer: {
		[theme.breakpoints.down('sm')]: {
			margin: '10px 0',
		},
	},
	yieldMechanics: {
		border: '1px solid #376EDC',
		margin: '0 10px',
		[theme.breakpoints.down('sm')]: {
			marginTop: '10px',
		},
	},
	icon: {
		marginTop: '5px',
	},
	brandColor: {
		width: '3px',
		height: '40px',
		marginLeft: '15px',
		backgroundColor: '#2036ff',
	},
	brandV2: {
		display: 'flex',
		order: '2',
	},
	divBlock: {
		width: '3px',
		height: '100%',
		marginRight: '15px',
		marginLeft: '15px',
		backgroundColor: colors.borderBlue,
	},
	links: {
		display: 'flex',
	},
	link: {
		padding: '12px 0px',
		margin: '0px 12px',
		cursor: 'pointer',
		'&:hover': {
			paddingBottom: '9px',
			borderBottom: '3px solid ' + colors.borderBlue,
		},
	},
	title: {
		textTransform: 'capitalize',
	},
	actionInput: {
		padding: '0px 0px 12px 0px',
		fontSize: '0.5rem',
	},
	linkActive: {
		padding: '12px 0px',
		margin: '0px 12px',
		cursor: 'pointer',
		paddingBottom: '9px',
		borderBottom: '3px solid ' + colors.borderBlue,
	},
	walletAddress: {
		padding: '12px',
		border: '1px solid rgba(47, 99, 165, .12)',
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		'&:hover': {
			border: '1px solid ' + colors.borderBlue,
			background: 'rgba(47, 128, 237, 0.1)',
		},
		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			border: '1px solid ' + colors.borderBlue,
			background: colors.white,
		},
	},
	walletTitle: {
		flex: 1,
		color: colors.darkGray,
	},
	connectedDot: {
		background: colors.compoundGreen,
		opacity: '1',
		width: '10px',
		height: '10px',
		marginRight: '3px',
		marginLeft: '6px',
	},
	name: {
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		position: 'absolute',
		width: 450,
		height: 600,
		overflow: 'scroll',
		overflowX: 'hidden',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		[theme.breakpoints.down('sm')]: {
			width: '90%',
		},
	},
	yeldMechanicsTitle: {
		borderBottom: '1px solid #e1e3e6',
	},
})

class Header extends Component {
	constructor(props) {
		super(props)

		this.state = {
			account: store.getStore('account'),
			modalOpen: false,
			retirementYeldAvailable: false, // When you have something to redeem
			earnings: 0,
			yeldBalance: 0,
			hoursPassedAfterStaking: 0,
			retirementYeldCurrentStaked: 0,
			stakeModalOpen: false,
			unstakeModalOpen: false,
			stakeAmount: 0,
			unStakeAmount: 0,
			yMechanicsModalOpen: false,
			stakeProcessing: false,
			unstakeProcessing: false,
			burnedBalance: null,
		}

		this.waitUntilSetupComplete()
	}

	waitUntilSetupComplete() {
		window.myInterval2 = setInterval(async () => {
			if (this.props.setupComplete) {
				window.clearInterval(window.myInterval2)
				await this.getBurnedYeld()
			}
		}, 1e2)
	}

	async getBurnedYeld() {
		const burnedBalance = window.web3.utils.fromWei(
			await this.props.yeld.methods
				.balanceOf('0x0000000000000000000000000000000000000000')
				.call()
		)
		this.setState({ burnedBalance })
	}

	componentWillMount() {
		emitter.on(CONNECTION_CONNECTED, this.connectionConnected)
		emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected)
	}

	componentWillUnmount() {
		emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected)
		emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected)
	}

	connectionConnected = () => {
		this.setState({ account: store.getStore('account') })
	}

	connectionDisconnected = () => {
		this.setState({ account: store.getStore('account') })
	}

	render() {
		const { classes } = this.props

		const { account, modalOpen } = this.state

		var address = null
		if (account.address) {
			address =
				account.address.substring(0, 6) +
				'...' +
				account.address.substring(
					account.address.length - 4,
					account.address.length
				)
		}

		return (
			<div className={classes.root}>
				<div className={classes.headerV2}>
					<div className={classes.icon}>
						<img
							alt=""
							src={require('../../assets/logo-v2-yeld.png')}
							height={'40px'}
							onClick={() => {
								this.nav('')
							}}
						/>
					</div>
					<div className={classes.brandColor}></div>
					<div className={classes.brandV2}>
						<div
							className={classes.brand}
							style={{
								alignContent: 'space-around',
								paddingLeft: '23px',
							}}>
							<Typography
								variant={'h3'}
								className={classes.name}
								style={{
									color: '#2036ff',
									fontSize: '16px',
									fontWeight: '500',
								}}
								onClick={() => {
									this.nav('')
								}}>
								YELD.APP{' '}
							</Typography>
							<Typography
								style={{
									marginBottom: '0',
									fontSize: '16px',
									lineHeight: '21px',
									fontWeight: '200',
								}}>
								{'Next-Generation Yield Farming'}
							</Typography>
						</div>
					</div>

					<Modal
						className={classes.modal}
						open={this.state.yMechanicsModalOpen}
						onClose={() => this.setState({ yMechanicsModalOpen: false })}
						aria-labelledby="simple-modal-title"
						aria-describedby="simple-modal-description">
						<div style={this.modalStyle} className={classes.paper}>
							<div className={classes.yeldMechanicsBox}>
								<div className={classes.yeldMechanicsTitle}>
									<div className={classes.icon}>
										<img
											alt=""
											src={require('../../assets/FireYeldMechanic.png')}
											height={'40px'}
											onClick={() => {
												this.nav('')
											}}
										/>
										<h2
											className={classes.exclusivesTitle}
											style={{ marginLeft: '20px' }}>
											Yeld mechanics
										</h2>
									</div>
								</div>

								<p>
									Every block you earn YELD tokens based on the stablecoin yield
									generated in addition to your standard yield to boost the APY.
								</p>
								<p>
									A portion of the yield returns will be used for the Buy and
									Burn mechanism to increase the token price.
								</p>
								<p>
									Users that hold YELD tokens can stake their YELD balance and
									redeem Retirement Yield everyday based on their holdings.
								</p>
								<p>To redeem your Retirement Yield follow these steps:</p>
								<ol>
									<li>Click on "Stake Yeld" with the amount to stake.</li>
									<br />
									<li>
										After 1 day or more, you'll be able to click on "Redeem
										Retirement Yield" and get ETH based on how much YELD you
										staked.
									</li>
									<br />
									<li>
										The larger percentage of the total YELD supply you stake,
										the more ETH you'll get from the Retirement Yield pool.
									</li>
								</ol>
							</div>
						</div>
					</Modal>
				</div>

				<div className={classes.account}>
					{/* Burned amount */}
					{!this.state.burnedBalance ? null : (
						<div><b>{Number(this.state.burnedBalance).toFixed(2)} YELD</b> burned&nbsp;</div>
					)}

					{/* Yield Mechanics */}
					<Button
						className={classes.yieldMechanics}
						variant="outlined"
						color="primary"
						onClick={() => this.setState({ yMechanicsModalOpen: true })}>
						<Typography variant={'h5'} color="secondary">
							Yield Mechanics
						</Typography>
					</Button>

					{/* Connect account button */}
					{address && (
						<Typography
							variant={'h4'}
							className={classes.walletAddress}
							onClick={this.addressClicked}>
							{address}
							<div className={classes.connectedDot}></div>
						</Typography>
					)}
					{!address && (
						<Typography
							variant={'h4'}
							className={classes.walletAddress}
							onClick={this.addressClicked}>
							Connect your wallet
						</Typography>
					)}
				</div>

				{modalOpen && this.renderModal()}
			</div>
		)
	}

	getModalStyle = () => {
		const top = 50 + Math.round(Math.random() * 20) - 10
		const left = 50 + Math.round(Math.random() * 20) - 10
		return {
			top: `${top}%`,
			left: `${left}%`,
			transform: `translate(-${top}%, -${left}%)`,
		}
	}

	renderLink = screen => {
		const { classes } = this.props

		return (
			<div
				className={
					window.location.pathname === '/' + screen
						? classes.linkActive
						: classes.link
				}
				onClick={() => {
					this.nav(screen)
				}}>
				<Typography variant={'h4'} className={`title`}>
					{screen}
				</Typography>
			</div>
		)
	}

	nav = screen => {
		if (screen === 'cover') {
			window.open('https://yinsure.finance', '_blank')
			return
		}
		this.props.history.push('/' + screen)
	}

	addressClicked = () => {
		this.setState({ modalOpen: true })
	}

	closeModal = () => {
		this.setState({ modalOpen: false })
	}

	renderModal = () => {
		return (
			<UnlockModal
				closeModal={this.closeModal}
				modalOpen={this.state.modalOpen}
			/>
		)
	}
}

export default withRouter(withStyles(styles)(Header))
