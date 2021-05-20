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
		int n;
};

istream& operator>>(istream& s, Test& t) {
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T, N, Q;

int query(int a, int b, int c)
{
	int k;
	cout << a << " " << b << " " << c << endl;
	cout.flush();
	cin >> k;
	return k;
}

void solve()
{
	vector<int> sol;
	int ans = query(1, 2, 3);
	if (ans == 1) {
		sol.push_back(2);
		sol.push_back(1);
		sol.push_back(3);
	} else if (ans == 2) {
		sol.push_back(1);
		sol.push_back(2);
		sol.push_back(3);
	} else if (ans == 3) {
		sol.push_back(1);
		sol.push_back(3);
		sol.push_back(2);
	}
	
	int nx{4};
	int s{3};
	while (s < N) {
		int l{0}, r{s};
		while (r - l > 2) {
			int ts = r-l;
			int i{l + ts/3 - 1}, j{l + 2*ts/3 - 1};
			assert(i != j && i >= 0 && j >= 0 && i < s && j < s);
			ans = query(sol[i], sol[j], nx);
			if (ans == sol[i]) {
				r = i;
			} else if (ans == sol[j]) {
				l = j+1;
			} else {
				l = i+1;
				r = j;
			}
		}
		if (r-l == 2) {
			ans = query(sol[l], sol[l+1], nx);
			if (ans == nx)
				sol.insert(sol.begin()+l+1, nx);
			else if (ans == sol[l])
				sol.insert(sol.begin()+l, nx);
			else if (ans == sol[l+1])
				sol.insert(sol.begin()+l+2, nx);
		} else if (r-l == 1) {
			if (l == 0) {
				ans = query(sol[l], nx, sol[r]);
				if (ans == sol[l])
					sol.insert(sol.begin()+l, nx);
				else
					sol.insert(sol.begin()+l+1, nx);
			} else {
				ans = query(sol[l], nx, sol[l-1]);
				if (ans == sol[l])
					sol.insert(sol.begin()+l+1, nx);
				else
					sol.insert(sol.begin()+l, nx);
			}
		} else if (r-l == 0) {
			sol.insert(sol.begin()+l, nx);
		} else {
			assert(false);
		}
		++s;
		++nx;
	}
	
	for (auto& x : sol)
		cout << x << " ";
	cout << endl;
	cout.flush();
	cin >> ans;
	assert(ans == 1);
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	//~ ios_base::sync_with_stdio(false);
	//~ cin.tie(0);
	
	//~ readInput();
	cin >> T >> N >> Q;
	// Solve each test
	while (T--) {
		solve();
	}
	
	return 0;
}
