#include <bits/stdc++.h>

using namespace std;

template <typename T>
inline T custom_ceil(T a, T b)
{
	return 1 + ((a - 1) / b);
}

void solve(int T, int n, int k, string& s)
{
	int g{0};
	for (int i=0; i < custom_ceil(n, 2); ++i) {
		if (s[i] != s[n-1-i])
			++g;
	}
	
	cout << "Case #" << T << ": " << abs(k-g) << endl;
}

int main()
{
	int T;
	cin >> T;
	int c{1};
	while (T--) {
		int n, k;
		string s;
		cin >> n >> k >> s;
		solve(c, n, k, s);
		++c;
	}
}
