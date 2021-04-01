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

template <typename T>
inline double log_b(T base, T x)
{
	return log(x)/log(base);
}

inline long double log_b(long double base, long double x)
{
	return log(x)/log(base);
}

template <typename T1, typename T2>
inline int perfect_log(T1 base, T2 x)
{
	int e = static_cast<int>(log_b(base, x));
	int best = {e};
	for (int k=-1; k < 2; ++k)
		if (pow(base, e+k) <= x)
			best = e+k;
	return best;
}





// USER CODE

struct Test {
	public:
		int n, m;
		vector<int> a, b, c;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.m;
	
	t.a.resize(t.n);
	t.b.resize(t.n);
	t.c.resize(t.m);
	for (int k = 0; k < t.n; ++k)
		s >> t.a[k];
	for (int k = 0; k < t.n; ++k)
		s >> t.b[k];
	for (int k = 0; k < t.m; ++k)
		s >> t.c[k];
	
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

void solve(Test& t)
{
	vector<deque<int>> planks(t.n+1);
	int diff{0};
	for (int k=0; k < t.n; ++k) {
		if (t.a[k] != t.b[k]) {
			planks[t.b[k]].push_back(k);
			++diff;
		}
	}
	
	if (t.m < diff) {
		cout << "NO\n";
		return;
	}
	
	//~ for (auto& x : planks)
		//~ for (auto & y : x)
			//~ debug(y);
	
	//~ debug("asdasdasd");
	
	vector<int> sol(t.m);
	vector<int> ignore;
	vector<int> toRepaint;
	for (int k=0; k < t.m; ++k) {
		if (planks[t.c[k]].size() > 0) {
			int pl = planks[t.c[k]].front();
			planks[t.c[k]].pop_front();
			while (ignore.size() > 0) {
				sol[ignore.back()] = pl+1;
				ignore.pop_back();
			}
			sol[k] = pl+1;
			--diff;
		} else {
			if (diff > 0) {
				ignore.push_back(k);
			} else {
				toRepaint.push_back(k);
			}
		}
	}
	
	//~ for (auto& x : toRepaint)
		//~ debug(x);
	//~ debug("diff", diff);
	//~ debug("toRepaint size", toRepaint.size());
	
	if (toRepaint.size() > 0) {
		int hope {toRepaint.back()};
		for (int k=0; k < t.n; ++k) {
			if (t.b[k] == t.c[hope]) {
				while (toRepaint.size() > 0) {
					sol[toRepaint.back()] = k+1;
					toRepaint.pop_back();
				}
				break;
			}
		}
	}
	
	if (diff > 0 || toRepaint.size() > 0) {
		cout << "NO\n";
	} else {
		cout << "YES\n";
		for (auto& x : sol)
			cout << x << " ";
		cout << endl;
	}
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
