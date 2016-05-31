// Ray.js

class Ray {
	constructor(mOrigin, mDirection) {
		this._origin = vec3.clone(mOrigin);
		this._direction = vec3.clone(mDirection);
	}

	at(t) {
		const target = vec3.clone(this._direction);
		vec3.scale(target, target, t);
		vec3.add(target, target, this._origin);

		return target;
	}


	lookAt(mTarget) {
		vec3.sub(this._direction, mTarget, this._origin);
		vec3.normalize(this._origin, this._origin);
	}

	closestPointToPoint(mPoint) {
		const result = vec3.create();
		vec3.sub(mPoint, this._origin);
		const directionDistance = vec3.dot(result, this._direction);

		if (directionDistance < 0) {
			return vec3.clone(this._origin);
		}

		vec3.copy(result, this._direction);
		vec3.scale(result, result, directionDistance);
		vec3.add(result, result, this._origin);

		return result;
	}


	distanceToPoint(mPoint) {
		return Math.sqrt(this.distanceSqToPoint(mPoint));
	}


	distanceSqToPoint(mPoint) {
		const v1 = vec3.create();

		vec3.sub(v1, mPoint, this._origin);
		const directionDistance = vec3.dot(v1, this._direction);

		if (directionDistance < 0) {
			return vec3.squaredDistance(this._origin, mPoint);
		}

		vec3.copy(v1, this._direction);
		vec3.scale(v1, v1, directionDistance);
		vec3.add(v1, v1, this._origin);
		return vec3.squaredDistance(v1, mPoint);
	}


	intersectsSphere(mCenter, mRadius) {
		return this.distanceToPoint(mCenter) <= mRadius;
	}


	intersectSphere(mCenter, mRadius) {
		const v1 = vec3.create();
		vec3.sub(v1, mCenter, this._origin);
		const tca = vec3.dot(v1, this._direction);
		const d2 = vec3.dot(v1, v1) - tca * tca;
		const radius2 = mRadius * mRadius;

		if(d2 > radius2) return null;

		const thc = Math.sqrt(radius2 - d2);

		const t0 = tca - thc;

		const t1 = tca + thc;

		if(t0 < 0 && t1 < 0) return null;

		if(t0 < 0) return this.at(t1);

		return this.at(t0);
	}


	distanceToPlane(mPlaneCenter, mNormal) {
		const denominator = vec3.dot(mNormal, this._direction);

		if(denominator === 0) {
		}
	}


	intersectTriangle(mPA, mPB, mPC, backfaceCulling = true) {
		const a = vec3.clone(mPA);
		const b = vec3.clone(mPB);
		const c = vec3.clone(mPC);

		const edge1 = vec3.create();
		const edge2 = vec3.create();
		const normal = vec3.create();
		const diff = vec3.create();

		vec3.sub(edge1, b, a);
		vec3.sub(edge2, c, a);
		vec3.cross(normal, edge1, edge2);

		let DdN = vec3.dot(this._direction, normal);
		let sign;

		if (DdN > 0) {
			if (backfaceCulling) {	return null;	}
			sign = 1;
		} else if (DdN < 0) {
			sign = -1;
			DdN = - DdN;
		} else {
			return null;
		}

		vec3.sub(diff, this._origin, a);

		vec3.cross(edge2, diff, edge2);
		const DdQxE2 = sign * vec3.dot(this._direction, edge2);
		if (DdQxE2 < 0) { 	return null; 	}

		vec3.cross(edge1, edge1, diff);
		const DdE1xQ = sign * vec3.dot(this._direction, edge1);
		if (DdE1xQ < 0) {	return null;	}

		if(DdQxE2 + DdE1xQ > DdN) {	return null;	}

		const Qdn = - sign * vec3.dot(diff, normal);
		if(Qdn < 0) {	return null;	}

		return this.at(Qdn / DdN);
	}


	get origin() {		return this._origin;	}

	get direction() {	return this._direction;	}

}

export default Ray;