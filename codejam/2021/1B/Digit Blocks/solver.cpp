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
		int n, a, b;
		vector<int> u;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.a >> t.b;
	t.u.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.u[k];
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
vector<Test> tests;


void readInput()
{
}

int choose(int D, const vector<int> &sizes, int N, int B)
{
	vector<pair<int,int>> ssizes;
	int left{N};
	for (int k=0; k < N; ++k) {
		ssizes.push_back({sizes[k], k});
		if (sizes[k] >= B-1)
			--left;
	}
	sort(ssizes.begin(), ssizes.end());
	
	auto best_lesst = [&] (int threshold) {
		for (int k=N-1; k >= 0; --k)
			if (ssizes[k].first < threshold)
				return ssizes[k].second;
		return -1;
	};
	
	if (D == 0) {
		//~ return ssizes[0].second;
		int res = best_lesst(B-3);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 1) {
		int res = best_lesst(B-2);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 2) {
		int res = best_lesst(B-2);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 3) {
		int res = best_lesst(B-2);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 4) {
		int res = best_lesst(B-2);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 5) {
		int res = best_lesst(B-2);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 6) {
		int res = best_lesst(B-1);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 7) {
		int res;
		if (false)
			res = best_lesst(B);
		else
			res = best_lesst(B-1);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 8) {
		int res;
		if (left <= 2)
			res = best_lesst(B);
		else
			res = best_lesst(B-1);
		return (res == -1 ? ssizes[0].second : res);
	
	} else if (D == 9) {
		return best_lesst(B);
	
	} else {
		assert(false);
		return -1;
	}
	
	assert(false);
	return -1;
}

void solve()
{
	//~ mt19937 rng(3);
	mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
	uniform_int_distribution<int> dist(0, 9);
	
	int T, N, B;
	long long P;
	
	//~ cin >> T >> N >> B >> P;
	//~ cout.flush();
	T = 50; N = 20; B = 15; P = 937467793908762347LL;
	
	long long tot{0};
	
	while (T--) {
		vector<vector<int>> blocks(N, vector<int>());
		vector<int> sizes(N, 0);
		
		for (int count=0; count < N*B; ++count) {
			int D;
			//~ cin >> D;
			//~ cout.flush();
			D = dist(rng);
			
			int c = choose(D, sizes, N, B);
			blocks[c].push_back(D);
			++sizes[c];
			//~ cout << c+1 << endl;
			//~ cout.flush();
		}
		
		vector<int> w(10, 0);
		for (int k=0; k < N; ++k) {
			++w[blocks[k][B-1]];
			assert(sizes[k] == B);
			long long base {1};
			for (auto& x : blocks[k]) {
				tot += x*base;
				base *= 10LL;
			}
		}
		for (int k=0; k < 10; ++k)
			if (w[k] > 0)
				cout << k << " " << w[k] << " ";
		cout << endl;
	}
	
	debug("tot", tot);
	
	if (tot >= P)
		cout << "OK BY " << tot - P << endl;
	else
		cout << "ERR BY " << P - tot << endl;
	//~ int res;
	//~ cin >> res;
	//~ cout.flush();
	//~ if (res == -1)
		//~ assert(false);
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	//~ ios_base::sync_with_stdio(false);
	//~ cin.tie(0);
	
	solve();
	
	return 0;
}
