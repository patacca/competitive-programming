#include <bits/stdc++.h>

using namespace std;

int main() {
	int N;
	cin >> N;
	unordered_map<string, int> m;
	int M = 0;
	string name;
	for (int k=0; k < N; ++k) {
		string n;
		cin >> n;
		++m[n];
		if (M < m[n]) {
			M = m[n];
			name = n;
		}
	}
	
	if (M > N/2)
		cout << name << endl;
	else
		cout << "NONE\n";
}
