import { v4 as uuidv4 } from 'uuid';

export default class DashboardShare {
	readonly id: string;
	private _status: Status;
	private _sharedWithUserId: string | null;
	readonly createdAt: Date;
	private _approvedAt: Date | null;

	constructor(
		readonly dashboard: string,
		readonly sharedWithEmail: string,
		sharedWithUserId?: string,
		status?: Status,
		createdAt?: Date,
		approvedAt?: Date,
		id?: string
	) {
		this.id = id ? id : uuidv4();
		this._status = status ? status : 'PendingApproval';
		this._sharedWithUserId = sharedWithUserId ? sharedWithUserId : null;
		this.createdAt = createdAt ? createdAt : new Date();
		this._approvedAt = approvedAt ? approvedAt : null;
	}

	acceptBy(userId: string, userEmail: string) {
		if (this.sharedWithEmail !== userEmail) {
			throw new Error('Dashboard share not authorized for user');
		}
		if (this.status !== 'PendingApproval') {
			throw new Error(
				'Cannot accept a dashboard share with status != PendingApproval'
			);
		}
		this._approvedAt = new Date();
		this._sharedWithUserId = userId;
		this._status = 'Approved';
	}

	cancelBy(userEmail: string) {
		if (this.sharedWithEmail !== userEmail) {
			throw new Error('Dashboard share not authorized for user');
		}
		if (this.status === 'PendingApproval') {
			this._status = 'Rejected';
		} else if (this.status === 'Approved') {
			this._status = 'Cancelled';
		}
	}

	get status() {
		return this._status;
	}

	get sharedWithUserId() {
		return this._sharedWithUserId;
	}

	get approvedAt() {
		return this._approvedAt;
	}
}

type Status = 'PendingApproval' | 'Approved' | 'Rejected' | 'Cancelled';