import { createDomAnchor } from '../../../src/ts/scripts/dom';

describe('Testing DOM scripts', () => {
	const ANCHOR_ID = 'anchorId';
	test('createDomAnchor - creates the first body element with an id', () => {
		createDomAnchor(ANCHOR_ID);
		expect(document.body.children[0].id).toBe(ANCHOR_ID);
	});
});
