#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}

struct custom_hash {
	static uint64_t splitmix64(uint64_t x) {
		// http://xorshift.di.unimi.it/splitmix64.c
		x += 0x9e3779b97f4a7c15;
		x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
		x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
		return x ^ (x >> 31);
	}

	static int splitmix32(int x) {
		uint64_t z = x;
		return (splitmix64(z) & 0xffffffff);
	}

	uint64_t operator()(uint64_t x) const {
		static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
		return splitmix64(x + FIXED_RANDOM);
	}

	int operator()(int x) const {
		static const int FIXED_RANDOM = (chrono::steady_clock::now().time_since_epoch().count() & 0xffffffff);
		return splitmix32(x + FIXED_RANDOM);
	}
};

template <typename T>
inline T custom_ceil(T a, T b)
{
	return 1 + ((a - 1) / b);
}




// USER CODE

struct Test {
	public:
		int n, u, r, d, l;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.u >> t.r >> t.d >> t.l;
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

bool setF(vector<int>& v, int i, int val)
{
	if (v[i] == -2 || v[i] == val) {
		v[i] = val;
		return true;
	} else {
		return false;
	}
}

void solve(Test& t)
{
	if (
		t.u <= t.n-2 &&
		t.r <= t.n-2 &&
		t.d <= t.n-2 &&
		t.l <= t.n-2
	) {
		cout << "YES\n";
		return;
	}
	
	if (t.n == 2) {
		vector<int> v {-2, -2, -2 ,-2};
		vector<int> c {t.u, t.r, t.d, t.l};
		
		bool ok{true};
		for (int rep=0; rep < 100; ++rep) {
			for (int k=0; k < 4; ++k) {
				int next {(k+1)%4};
				if (c[k] == 2) {
					ok &= setF(v, k, 1);
					ok &= setF(v, next, 1);
				} else if (c[k] == 0) {
					ok &= setF(v, k, 0);
					ok &= setF(v, next, 0);
				} else if (c[k] == 1) {
					if (v[k] == 0) {
						ok &= setF(v, next, 1);
					} else if (v[next] == 0) {
						ok &= setF(v, k, 1);
					} else if (v[k] == 1) {
						ok &= setF(v, next, 0);
					} else if (v[next] == 1) {
						ok &= setF(v, k, 0);
					}
				}
			}
		}
		if (ok)
			cout << "YES\n";
		else
			cout << "NO\n";
		return;
	}
	
	int l {t.n-2};
	vector<int> v {-2, -2, -2 ,-2};
	vector<int> c {
		(t.u == 0 ? 0 : (t.u == 1 ? -1 : (t.u - l > 0 ? t.u - l : -2))),
		(t.r == 0 ? 0 : (t.r == 1 ? -1 : (t.r - l > 0 ? t.r - l : -2))),
		(t.d == 0 ? 0 : (t.d == 1 ? -1 : (t.d - l > 0 ? t.d - l : -2))),
		(t.l == 0 ? 0 : (t.l == 1 ? -1 : (t.l - l > 0 ? t.l - l : -2)))
	};
	
	bool ok{true};
	for (int rep=0; rep < 100; ++rep) {
		for (int k=0; k < 4; ++k) {
			int next {(k+1)%4};
			if (c[k] == 2) {
				ok &= setF(v, k, 1);
				ok &= setF(v, next, 1);
			} else if (c[k] == 0) {
				ok &= setF(v, k, 0);
				ok &= setF(v, next, 0);
			} else if (c[k] == 1) {
				if (v[k] == 0) {
					ok &= setF(v, next, 1);
				} else if (v[next] == 0) {
					ok &= setF(v, k, 1);
				}
			} else if (c[k] == -1) {
				if (v[k] == 1) {
					ok &= setF(v, next, 0);
				} else if (v[next] == 1) {
					ok &= setF(v, k, 0);
				}
			}
		}
	}
	if (ok)
		cout << "YES\n";
	else
		cout << "NO\n";
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		solve(t);
	}
	
	return 0;
}
