#include <bits/stdc++.h>

using namespace std;


int main() {
	int N;
	cin >> N;
	
	long double area = 0;
	
	while (N--) {
		int P;
		cin >> P;
		long long x1, y1;
		cin >> x1 >> y1;
		--P;
		long long xprev, yprev;
		xprev = x1;
		yprev = y1;
		long long s1 = 0;
		long long s2 = 0;
		while (P--) {
			long long x, y;
			cin >> x >> y;
			s1 += xprev*y;
			s2 += x*yprev;
			xprev = x;
			yprev = y;
		}
		s1 += xprev*y1;
		s2 += x1*yprev;
		
		area += abs(((long double)(s1 - s2))/2);
		// 1/2 (sum(xi*yi+1) + xn*y1 - sum(xi+1*yi) - x1*yn)
	}
	
	cout << (long long)area << endl;
}
