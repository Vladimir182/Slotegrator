import { rRender } from '../../utils/helper';

const config = [
	{
		href: '/',
		text: 'Dashboard',
		checkRender: resources => {
			return(
				rRender(resources, 'deposits', 'allow_view') ||
				rRender(resources, 'withdraws', 'allow_view') ||
				rRender(resources, 'terminals', 'allow_view')
			)
		}
	},
	{
		href: '/terminals',
		text: 'Terminals',
		checkRender: resources => rRender(resources, 'terminals', 'allow_view')
	},
	{
		href: '/nodes',
		text: 'Node Management',
		checkRender: resources => rRender(resources, 'merchants', 'allow_view')
	},
	{
		line: true,
		checkRender: resources => {
			return (
				rRender(resources, 'merchants', 'allow_view') ||
				rRender(resources, 'rooms', 'allow_view') ||
				rRender(resources, 'terminals', 'allow_view')
			);
		}
	},
	{
		href: '/encashment-history',
		text: 'Encashment History',
		checkRender: (resources, selected, terminal) => {
			return selected.nodeType === 'terminal' && rRender(resources, 'encashments', 'allow_view') || (
				rRender(resources, 'encashments', 'allow_view') 
				&& terminal 
				&& (terminal.validator.is_exist || terminal.dispenser.is_exist)
			);
		},
		children: [
			{
				href: '/encashment-history/validator',
				text: 'Validator',
				checkRender: (resources, selected, terminal) => selected.nodeType !== 'terminal' && rRender(resources, 'encashments', 'allow_view') 
					|| (selected.nodeType === 'terminal' && terminal && terminal.validator.is_exist && rRender(resources, 'encashments', 'allow_view'))
			},
			{
				href: '/encashment-history/dispenser',
				text: 'Dispenser',
				checkRender: (resources, selected, terminal) => selected.nodeType !== 'terminal' && rRender(resources, 'encashments', 'allow_view') 
					|| (selected.nodeType === 'terminal' && terminal && terminal.dispenser.is_exist && rRender(resources, 'encashments', 'allow_view'))
			}
		]
	},
	{
		href: '/encashment',
		text: 'Encashment',
		checkRender: (resources, selected, terminal) => {
			return (selected.nodeType === 'terminal' && terminal && (terminal.validator.is_exist || terminal.dispenser.is_exist)) 
					&& rRender(resources, 'encashments', 'allow_create')
		},
		children: [
			{
				href: '/encashment/validator',
				text: 'Validator',
				checkRender: (resources, selected ,terminal) => {
					return (terminal && terminal.validator.is_exist)
						&& rRender(resources, 'encashments', 'allow_view') ||
						rRender(resources, 'encashments', 'allow_create') 
				}
			},
			{
				href: '/encashment/dispenser',
				text: 'Dispenser',
				checkRender: (resources, selected, terminal) => {
					return (terminal && terminal.dispenser.is_exist) 
						&& rRender(resources, 'encashments', 'allow_view') || 
						rRender(resources, 'encashments', 'allow_create')
				}
			},
		]	
	},
	{
		line: true,
		checkRender: (resources, selected) => {
			return (
				(selected.nodeType === 'terminal' &&
					rRender(resources, 'encashments', 'allow_create')) ||
				(selected.nodeType === 'terminal' &&
					rRender(resources, 'encashments', 'allow_create'))
			);
		}
	},
	{
		href: '/withdraw',
		text: 'Withdraw',
		checkRender: resources => {
			return rRender(resources, 'withdraws', 'allow_view');
		}
	},
	{
		href: '/deposit',
		text: 'Deposit',
		checkRender: resources => {
			return rRender(resources, 'deposits', 'allow_view');
		}
	},
	{
		href: '/reports',
		text: 'Reports',
		checkRender: resources => {
			return rRender(resources, 'reports', 'allow_view');
		}
	},

	{
		line: true,
		checkRender: (resources) => {
			return (
				rRender(resources, 'withdraws', 'allow_view') ||
				rRender(resources, 'deposits', 'allow_view')
			);
		}
	},

	{
		href: '/users',
		text: 'Users',
		checkRender: resources => {
			return rRender(resources, 'users', 'allow_view');
		}
	},
	{
		href: '/roles',
		text: 'Roles',
		checkRender: resources => {
			return rRender(resources, 'permissions', 'allow_view');
		}
	},
	{
		line: true,
		checkRender: (resources) => {
			return (
				rRender(resources, 'users', 'allow_view') ||
				rRender(resources, 'permissions', 'allow_view')
			);
		}
	},
	{
		href: '/terminal',
		text: 'Terminal',
		checkRender: (resources, selected) => {
			return (
				selected.nodeType === 'terminal' &&
				rRender(resources, 'terminals', 'allow_update')
			);
		}
	},
	{
		onlySuperAdmin: true,
		href: '/drivers',
		text: 'Drivers',
		checkRender: (resources, selected) => {
			return (
			selected.nodeType === 'terminal' &&
			rRender(resources, 'driver_versions', 'allow_view')
			)
		}
	},
	{
		line: true,
		checkRender: (resources, selected) => {
			return (
				selected.nodeType === 'terminal' &&
				rRender(resources, 'terminals', 'allow_update')
			);
		}
	},
	{
		href: '/logs',
		text: 'Logs',
		checkRender: resources => {
			return rRender(resources, 'logs', 'allow_view');
		}
	},
	{
		href: '/',
		text: 'Api',
		checkRender: resources => {
			return (
				rRender(resources, 'api_documentation', 'allow_view')
				|| rRender(resources, 'admin_documentation','allow_view')
				|| rRender(resources, 'pps_api_documentation', 'allow_view')
			)
		},
		children: [
			{
				href: '/api_docs',
				text: 'All Api',
				target: '_blank',
				checkRender: resources => {
					return rRender(resources, 'api_documentation', 'allow_view');
				}
			},
			{
				href: '/pps_api_docs',
				text: 'FinPro Api',
				target: '_blank',
				checkRender: resources => {
					return rRender(resources, 'pps_api_documentation', 'allow_view');
				}
			},
			{
				href: '/admin_docs',
				text: 'Admin Api',
				target: '_blank',
				checkRender: resources => {
					return rRender(resources, 'admin_documentation', 'allow_view');
				}
			}
		]
	}
];

export default config;
