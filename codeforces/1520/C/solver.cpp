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

/* Extended Euclidean Algorithm */
template <typename T>
T extended_euclidean(T a, T b, T& x, T& y) {
	x = (T)1;
	y = (T)0;
	T x1 = (T)0;
	T y1 = (T)1;
	T a1 = a;
	T b1 = b;
	while (b1) {
		T q = a1 / b1;
		tie(x, x1) = make_tuple(x1, x - q * x1);
		tie(y, y1) = make_tuple(y1, y - q * y1);
		tie(a1, b1) = make_tuple(b1, a1 - q * b1);
	}
	return a1;
}

void segmented_sieve_optimized(int n, vector<int>& primes) {
	const int S = 30'000;
	
	int nsqrt = round(sqrt(n));
	
	vector<char> is_prime(nsqrt + 1, true);
	vector<int> lowPrimes, start_indices;
	for (int i = 3; i <= nsqrt; i += 2) {
		if (is_prime[i]) {
			lowPrimes.push_back(i);
			start_indices.push_back((i * i - 1) / 2);
			for (int j = i * i; j <= nsqrt; j += 2 * i)
				is_prime[j] = false;
		}
	}
	
	primes.push_back(2);
	vector<char> block(S);
	int high = (n - 1) / 2;
	for (int low = 0; low <= high; low += S) {
		fill(block.begin(), block.end(), true);
		for (auto i = 0u; i < lowPrimes.size(); i++) {
			int p = lowPrimes[i];
			int idx = start_indices[i];
			for (; idx < S; idx += p)
				block[idx] = false;
			start_indices[i] = idx - S;
		}
		if (low == 0)
			block[0] = false;
		for (int i = 0; i < S && low + i <= high; i++) {
			if (block[i])
				primes.push_back((low + i) * 2 + 1);
		}
	};
}




// USER CODE

struct Test {
	public:
		int n;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
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

void printM(vector<vector<int>>& m, int n) {
	cout << "MATRIX" << endl;
	for (int x=0; x < n; ++x) {
		for (int y=0; y < n; ++y)
			cout << m[x][y] << " ";
		cout << endl;
	}
	cout << "END" << endl;
}

void solve(Test& t)
{
	if (t.n == 1) {
		cout << "1\n";
		return;
	}
	if (t.n == 2) {
		cout << "-1\n";
		return;
	}
	if (t.n == 3) {
		cout << "1 3 5\n4 6 8\n7 9 2\n";
		return;
	}
	if (t.n == 5) {
		cout << "1 3 5 7 9\n4 6 8 10 12\n11 13 15 17 19\n14 16 18 20 22\n24 21 23 2 25\n";
		return;
	}
	
	vector<vector<int>> m(t.n, vector<int>(t.n, -1));
	
	int r{0}, c{0};
	int num = 1;
	for (int j=0; j < t.n/2; ++j) {
		for (int k=0; k < t.n; ++k) {
			m[r][c] = num;
			num += 2;
			++c;
		}
		c = 0;
		++r;
		int num2 = m[r-1][c] + 3;
		for (int k=0; k < t.n; ++k) {
			m[r][c] = num2;
			num2 += 2;
			++c;
		}
		++r;
		c = 0;
	}
	if (t.n % 2 == 1) {
		int min = t.n*t.n - (t.n - 1) + 2;
		int max = t.n*t.n;
		int extra = min - 2;
		int last = 2;
		
		int mid1 = (min+max)/2;
		int mid2 = mid1+1;
		
		m[r][c] = mid1;
		++c;
		m[r][c] = extra;
		++c;
		m[r][c] = mid2;
		++c;
		m[r][c] = last;
		++c;
		
		int num2 = max;
		for (int k=min; k < mid1; ++k) {
			m[r][c] = k;
			++c;
			m[r][c] = num2;
			++c;
			--num2;
		}
	} else {
		m[t.n-1][t.n-1] = 2;
	}
	
	//~ printM(m, t.n);
	
	for (int x=0; x < t.n; ++x) {
		for (int y=0; y < t.n; ++y)
			cout << m[x][y] << " ";
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
