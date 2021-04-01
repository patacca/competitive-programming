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

/* Fast inverse of a modulo p (p must be prime) */
template <typename T>
long long fast_inv(T a, T p) {
	long long res = 1;
	long long p2 {p-2};
	while (p2) {
		if (p2 % 2 == 0) {
			a = a * 1ll * a % p;
			p2 /= 2;
		} else {
			res = res * 1ll * a % p;
			p2--;
		}
	}
	return res;
}





// USER CODE

struct Test {
	public:
		int n, k;
		vector<int> h;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.k;
	t.h.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.h[k];
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
	// {min, max}
	pair<int, int> end, start;
	for (int k=0; k < t.n; ++k) {
		if (k == 0) {
			end = {t.h[k] + t.k, t.h[k] + t.k};
			start = {t.h[k], t.h[k]};
			//~ debug("min", start.first, end.first, "max", start.second, end.second);
			continue;
		} else if (k == t.n-1) {
			if (t.h[k]+t.k > start.first && t.h[k] < end.second) {
				cout << "YES\n";
				return;
			} else
				goto err;
		}
		
		pair<int, int> newEnd {t.h[k] + t.k, t.h[k] + t.k + t.k-1};
		pair<int, int> newStart {t.h[k], t.h[k] + t.k-1};
		
		if (newStart.first >= end.second || newEnd.second <= start.first)
			goto err;
		
		// assert(we have a solution)
		
		if (newEnd.first <= start.first) {
			// not ok, newStart.first && newEnd.first must be traslated by X
			int traslation {start.first-newEnd.first+1};
			if (traslation > t.k-1)
				goto err; // this should never be called
			newStart.first += traslation;
			newEnd.first += traslation;
		}
		
		if (newStart.second >= end.second) {
			// not ok, newStart.second && newEnd.second must be traslated by -X
			int traslation {newStart.second-end.second+1};
			if (traslation > t.k-1)
				goto err;
			newStart.second -= traslation;
			newEnd.second -= traslation;
		}
		start = newStart;
		end = newEnd;
		//~ debug("min", start.first, end.first, "max", start.second, end.second);
	}
	
err:
	cout << "NO\n";
	return;
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
