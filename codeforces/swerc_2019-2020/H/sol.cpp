#include <bits/stdc++.h>

using namespace std;


int main() {
	long long N;
	cin >> N;
	
	//~ auto F = [&] (long long a) { return (a + (a>>20) + 12345) % 0x10000000000; };
	auto F = [&] (long long a) { return (a + (a>>20) + 12345) & 0xffffffffff; };
	
	long long start = 350125310;
	long long cycle = 182129209;
	long long intermediate = 175062655;
	long long startAns = 175147925;
	long long intermiediateAns = 87600494;
	long long cycleAns = 91029304;
	long long intermediateN = 114307527999;
	long long first = 516914;
	long long n = 0x600dcafe;
	long long ans = 0;
	
	if (N <= start) {
		if (N >= intermediate) {
			ans += intermiediateAns;
			N -= intermediate;
			n = intermediateN;
		}
		while (N--) {
			ans += (n&1 ? 0 : 1);
			n = F(n);
		}
		
		cout << ans << endl;
		return 0;
	}
	ans = startAns;
	N -= start;
	ans += cycleAns*(N/cycle);
	N = N % cycle;
	
	n = first;
	while (N--) {
		ans += (n&1 ? 0 : 1);
		n = F(n);
	}
	
	cout << ans << endl;
	
	
	//~ long long tortoise, hare;
	
	//~ // tortoise = hare = 0x600dcafe;
	
	//~ tortoise = F(0x600dcafe);
	//~ hare = F(tortoise);
	
	//~ while (tortoise != hare) {
		//~ tortoise = F(tortoise);
		//~ hare = F(F(hare));
	//~ }
	
	//~ long long c = 1;
	//~ hare = F(hare);
	//~ while (tortoise != hare) {
		//~ hare = F(hare);
		//~ ++c;
	//~ }
	
	//~ cout << c << endl;
	
	//~ long long s = 1;
	
	//~ tortoise = 0x600dcafe;
	//~ long long stop = hare;
	//~ while (tortoise != hare) {
		//~ tortoise = F(tortoise);
		//~ hare = F(hare);
		//~ ++s;
	//~ }
	
	//~ cout << tortoise << endl;
	//~ cout << s << endl;
	
	//~ long long ans = 0;
	//~ long long it = 350125310;
	//~ long long n = 0x600dcafe;
	
	//~ while (it--) {
		//~ ans += (n&1 ? 0 : 1);
		//~ n = F(n);
	//~ }
	
	//~ cout << ans << endl;
	
	//~ ans = 0;
	//~ it = 182129209;
	//~ n = tortoise;
	
	//~ while (it--) {
		//~ ans += (n&1 ? 0 : 1);
		//~ n = F(n);
	//~ }
	
	//~ cout << ans << endl;
	
	return 0;
}
