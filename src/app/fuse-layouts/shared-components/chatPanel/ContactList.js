import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChat } from './store/chatSlice';
import { selectContacts } from './store/contactsSlice';
import { openChatPanel } from './store/stateSlice';

const useStyles = makeStyles(theme => ({
	root: {
		background: theme.palette.background.paper
	},
	contactButton: {
		width: 70,
		minWidth: 70,
		flex: '0 0 auto',
		'&.active:after': {
			position: 'absolute',
			top: 8,
			right: 0,
			bottom: 8,
			content: "''",
			width: 4,
			borderTopLeftRadius: 4,
			borderBottomLeftRadius: 4,
			backgroundColor: theme.palette.primary.main
		}
	},
	unreadBadge: {
		position: 'absolute',
		minWidth: 18,
		height: 18,
		top: 4,
		left: 10,
		borderRadius: 9,
		padding: '0 5px',
		fontSize: 11,
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
		boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.35)',
		zIndex: 10
	},
	status: {
		position: 'absolute',
		width: 12,
		height: 12,
		bottom: 4,
		left: 44,
		border: `2px solid ${theme.palette.background.default}`,
		borderRadius: '50%',
		zIndex: 10,

		'&.online': {
			backgroundColor: '#4CAF50'
		},

		'&.do-not-disturb': {
			backgroundColor: '#F44336'
		},

		'&.away': {
			backgroundColor: '#FFC107'
		},

		'&.offline': {
			backgroundColor: '#646464'
		}
	}
}));

function ContactList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const selectedContactId = useSelector(({ chatPanel }) => chatPanel.contacts.selectedContactId);
	const chatList = useSelector(({ chatPanel }) => chatPanel.chatList);

	const classes = useStyles();
	const contactListScroll = useRef(null);

	const handleContactClick = contactId => {
		dispatch(openChatPanel());
		dispatch(getChat(contactId));
		scrollToTop();
	};

	const scrollToTop = () => {
		contactListScroll.current.scrollTop = 0;
	};

	const ContactButton = ({ contact }) => {
		return (
			<Tooltip title={contact.name} placement="left">
				<Button
					onClick={() => handleContactClick(contact.id)}
					className={clsx(classes.contactButton, { active: selectedContactId === contact.id })}
				>
					{contact.unread && <div className={classes.unreadBadge}>{contact.unread}</div>}
					<div className={clsx(contact.status, classes.status)} />
					<Avatar src={contact.picture} alt={contact.name}>
						{!contact.picture || contact.picture === '' ? contact.name[0] : ''}
					</Avatar>
				</Button>
			</Tooltip>
		);
	};

	return (
		<FuseScrollbars
			className={clsx(classes.root, 'flex flex-shrink-0 flex-col overflow-y-auto py-8')}
			ref={contactListScroll}
		>
			{contacts.length > 0
				? (
						<>
							<FuseAnimateGroup
								enter={{
									animation: 'transition.expandIn'
								}}
								className="flex flex-col flex-shrink-0"
							>
								{chatList &&
									chatList.map(chat => {
										const contact = contacts.find(_contact => _contact.id === chat.id);
										return contact ? <ContactButton key={contact.id} contact={contact} /> : null;
									})}
								<Divider className="mx-24 my-8" />
								{contacts.map(contact => {
									const chatContact = chatList?.find(_chat => _chat.id === contact.id);
									return !chatContact ? <ContactButton key={contact.id} contact={contact} /> : null;
								})}
							</FuseAnimateGroup>
						</>
					)
				: null
			}
		</FuseScrollbars>
	);
}

export default React.memo(ContactList);
