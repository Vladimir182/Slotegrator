import ApiClient from './ApiClient.js';
import DepositAPI from './Deposit.js';
import WithdrawAPI from './Withdraw.js';
import UserAPI from './User.js';
import RoleAPI from './Role.js';
import MerchantAPI from './Merchant.js';
import RoomAPI from './Room.js';
import TerminalAPI from './Terminal.js';
import ValidatorAPI from './Validator.js';
import DispenserAPI from './Dispenser.js';
import LogsAPI from './Logs.js';
import ReportsAPI from './Reports.js';
import TerminalDriversAPI from './TerminalDrivers.js';
import AuthAPI from './Auth.js';
import IntegrationAPI from './Integration.js';

export default function({ apiPrefix } = {}) {
	
	if (!apiPrefix) {
		throw new Error('apiPrefix is required');
	}

	const apiClient = new ApiClient({ prefix: apiPrefix });
	const apiClientIntegration = new ApiClient({ prefix: '/api/' });

	return {
		apiClient,
		auth: new AuthAPI({ apiClient }),
		role: new RoleAPI({ apiClient }),
		user: new UserAPI({ apiClient }),
		deposit: new DepositAPI({ apiClient }),
		withdraw: new WithdrawAPI({ apiClient }),
		terminal: new TerminalAPI({ apiClient }),
		drivers: new TerminalDriversAPI({ apiClient }),
		room: new RoomAPI({ apiClient }),
		merchant: new MerchantAPI({ apiClient }),
		logs: new LogsAPI({ apiClient }),
		reports: new ReportsAPI({ apiClient }),
		validator: new ValidatorAPI({ apiClient }),
		dispenser: new DispenserAPI({ apiClient }),
		integration: new IntegrationAPI({ apiClient: apiClientIntegration })
	};
}
