import { CustomMolang } from '../../lib/custom/main'
import { test, expect } from 'vitest'

test('Custom syntax', () => {
	const customMolang = new CustomMolang({})

	customMolang.parse(
		`
			function('sq', 'base', { return math.pow(arg.base, 2); });
			function('on_axis', 'axis', { return arg.axis == 'x' ? v.x : v.y; });
			function('fibonacci', 'total', {
				t.current = 0;
				t.prev = 0;
				loop(a.total, t.current == 0 ? {t.current = 1;} : {t.tmp = t.current; t.current = t.current + t.prev; t.prev = t.tmp;});
				return t.current;
			});
			function('pow', 'base', 'exp', {
				return a.exp == 0 ? 1 : a.base * f.pow(a.base, a.exp - 1);
			});

			# Comment test return 1;
			function('get_axis', 'axis', {
				a.axis == 'x' ? { return v.x; };
				a.axis == 'y' ? { return v.y; };
				return v.z;
			});
			function('pi', {
				return math.pi;
			});
			function('early_return', 'return_0', {
				a.return_0 ? {
					return 0;
				};
				return 1;
			});
			function('dead_end', 'return_0', {
				a.return_0 ? {
					return 0;
				} : {
					return 1;
				};
				t.test = 0;
				return t.test;
			});
			function('complex_early_return', 'return_0', {
				a.return_0 ? {
					a.return_0 > 1 ? {
						return a.return_0;
					};
					return 0;
				};
				a.return_0 == 1 ? {
					return 2;
				};
				return 1;
			});
			function('simple_early_return', 'return_0', {
				return 3;
				a.return_0 ? {
					a.return_0 > 1 ? {
						return a.return_0;
					};
					return 0;
				};
				a.return_0 == 1 ? {
					return 2;
				};
				return 1;
			});
			function('op_precedence', 'm', {
				return -(a.m + 1);
			});

			# Make sure that .molang files support using double quotes
			function("test_double_quotes", {
				return 0;
			});

			# Ensure that structs are properly supported
			function('create_list', {
				t.list.length = 0;
				return t.list;
			});
			# Ensure that functions without return statements work correctly
			function('test_no_return', {
				t.test = 0;
			});
		`
	)

	expect(customMolang.transform('f.pow(2, 2)')).toBe('4')
	expect(customMolang.transform('f.fibonacci(4)')).toBe(
		'return ({t.__scvar0=0;t.__scvar1=0;loop(4,t.__scvar0==0?{t.__scvar0=1;}:{t.__scvar2=t.__scvar0;t.__scvar0=t.__scvar0+t.__scvar1;t.__scvar1=t.__scvar2;});t.__scvar3=t.__scvar0;}+t.__scvar3);'
	)
	expect(
		customMolang.transform('f.pow(2, f.pow(2,2)) + f.fibonacci(0)')
	).toBe(
		'return 16+({t.__scvar0=0;t.__scvar1=0;t.__scvar3=t.__scvar0;}+t.__scvar3);'
	)
	expect(customMolang.transform('f.sq(2)')).toBe('(math.pow(2,2))')
	expect(customMolang.transform("f.sq(f.on_axis('x'))")).toBe(
		'(math.pow((v.x),2))'
	)

	expect(customMolang.transform('f.get_axis(t.axis)')).toBe(
		"return ({t.axis=='x'?{t.__scvar0=v.x;}:{t.axis=='y'?{t.__scvar0=v.y;}:{t.__scvar0=v.z;};};}+t.__scvar0);"
	)
	expect(customMolang.transform('t.x = 1; f.sq(2);')).toBe(
		't.x=1;(math.pow(2,2));'
	)
	expect(customMolang.transform('t.x = 1; return f.sq(2);')).toBe(
		't.x=1;return (math.pow(2,2));'
	)
	expect(customMolang.transform('f.pi()')).toBe('(math.pi)')
	expect(customMolang.transform('f.early_return(v.is_true)')).toBe(
		'return ({v.is_true?{t.__scvar0=0;}:{t.__scvar0=1;};}+t.__scvar0);'
	)
	expect(customMolang.transform('f.early_return(v.x)')).toBe(
		'return ({v.x?{t.__scvar0=0;}:{t.__scvar0=1;};}+t.__scvar0);'
	)
	// TODO: Once temp variable elimination is in, this should just return '1'
	expect(customMolang.transform('f.early_return(0)')).toBe(
		'return ({t.__scvar0=1;}+t.__scvar0);'
	)
	expect(customMolang.transform('f.dead_end(v.x)')).toBe(
		'return ({v.x?{t.__scvar0=0;}:{t.__scvar0=1;};}+(t.__scvar0??0));'
	)
	expect(customMolang.transform('f.complex_early_return(v.x)')).toBe(
		'return ({v.x?{v.x>1?{t.__scvar0=v.x;}:{t.__scvar0=0;};}:{v.x==1?{t.__scvar0=2;}:{t.__scvar0=1;};};}+t.__scvar0);'
	)
	expect(customMolang.transform('f.simple_early_return(v.x)')).toBe('3')
	expect(customMolang.transform('f.op_precedence(1)')).toBe('-2')
	expect(customMolang.transform('f.create_list()')).toBe(
		`return ({t.__scvar0.length=0;t.__scvar1=t.__scvar0;}+t.__scvar1);`
	)
	expect(customMolang.transform('f.test_no_return()')).toBe(
		`return ({t.__scvar0=0;});`
	)
})
