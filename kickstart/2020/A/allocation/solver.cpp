#include <bits/stdc++.h>

using namespace std;

int T;


int main()
{
	cin >> T;
	int n, b;
	vector<int> a;
	int c{0};
	while (T--) {
		++c;
		cin >> n >> b;
		a.clear();
		a.resize(n);
		for (int k=0; k < n; ++k)
			cin >> a[k];
		sort(a.begin(), a.end());
		int k{0};
		while (k < n && b >= a[k]) {
			b -= a[k];
			++k;
		}
		cout << "Case #" << c << ": " << k << endl;
	}
}
