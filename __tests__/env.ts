import { Molang } from '../lib/main'
import { test, expect } from 'vitest'

test('execute without provided env', () => {
	const molang = new Molang()
	expect(molang.execute('math.pow(2,2)')).toBe(4)
})

// Test standard env
const molang = new Molang({
	'query.array': [1, 2, 3],
	'query.simple': 2,
})

const tests: Record<string, any> = {
	'query.any(1,1,2,3)': 1,
	'query.any(1,2,3)': 0,
	'query.all(1,1,2,3)': 0,
	'query.all(1,1,1,1)': 1,
	'query.in_range(1,1,2)': 1,
	'query.in_range(2,1,2)': 1,
	'query.in_range(3,1,2)': 0,
	'query.count(q.array)': 3,
	'query.count(3)': 1,
	'query.self->query.simple': 2,
	'query.self->query.count(2)': 1,
}

test('Standard Environment', () => {
	for (const test in tests) {
		expect(molang.execute(test)).toBe(tests[test])
	}
})

test('Object within env', () => {
	const molang = new Molang({
		'context.position': {
			x: () => 1,
			y: () => 2,
		},
	})

	expect(molang.execute('c.position.x')).toBe(1)
	expect(molang.execute('c.position.y')).toBe(2)
})
