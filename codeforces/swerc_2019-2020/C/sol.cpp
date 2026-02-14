#include <bits/stdc++.h>

using namespace std;

int main() {
	int N;
	cin >> N;
	vector<bool> m(N+1, false);
	for (int k=0; k < N; ++k) {
		string s;
		cin >> s;
		if (s.size() > 7)
			continue;
		int n = stoi(s);
		if (n < 0 || n > N)
			continue;
		m[n] = true;
	}
	
	for (int k=0; k <= N; ++k)
		if (m[k] == false) {
			cout << k << endl;
			return 0;
		}
}
