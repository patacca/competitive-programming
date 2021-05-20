#include <bits/stdc++.h>
using namespace std;
#define sim template < class c
#define ris return * this
#define dor > debug & operator <<
#define eni(x) sim > typename \
  enable_if<sizeof dud<c>(0) x 1, debug&>::type operator<<(c i) {
sim > struct rge { c b, e; };
sim > rge<c> range(c i, c j) { return rge<c>{i, j}; }
sim > auto dud(c* x) -> decltype(cerr << *x, 0);
sim > char dud(...);
struct debug {
#ifdef LOCAL
~debug() { cerr << endl; }
eni(!=) cerr << boolalpha << i; ris; }
eni(==) ris << range(begin(i), end(i)); }
sim, class b dor(pair < b, c > d) {
  ris << "(" << d.first << ", " << d.second << ")";
}
sim dor(rge<c> d) {
  *this << "[";
  for (auto it = d.b; it != d.e; ++it)
	*this << ", " + 2 * (it == d.b) << *it;
  ris << "]";
}
#else
sim dor(const c&) { ris; }
#endif
};
#define imie(...) " [" << #__VA_ARGS__ ": " << (__VA_ARGS__) << "] "
// debug & operator << (debug & dd, P p) { dd << "(" << p.x << ", " << p.y << ")"; return dd; }

// vector<int> hidden;
int n = 50;
int operations;

int query(int i, int j, int k) {
	operations++;
	printf("%d %d %d\n", i + 1, j + 1, k + 1);
	fflush(stdout);
	int x;
	scanf("%d", &x);
	assert(x != -1);
	return x - 1;
	
	// vector<pair<int,int>> v;
	// for(int x : {i, j, k}) {
		// v.emplace_back(hidden[x], x);
	// }
	// sort(v.begin(), v.end());
	// return v[1].second;
}

vector<int> solve_three(vector<int> a) {
	assert((int) a.size() == 3);
	int x = query(a[0], a[1], a[2]);
	if(x == a[0]) {
		swap(a[0], a[1]);
	}
	else if(x == a[2]) {
		swap(a[1], a[2]);
	}
	assert(a[1] == x);
	return a;
}

vector<int> solve_four(vector<int> a) {
	assert((int) a.size() == 4);
	int x = query(a[0], a[1], a[2]);
	int y = query(a[0], a[1], a[3]);
	// if(x != y && x == a[0] && y == a[1]) {
		// return {a[2], a[0], a[1], a[3]};
	// }
	// if(x != y && x == a[1] && y == a[0]) {
		// return {a[3], a[0], a[1], a[2]};
	// }
	int z = x;
	set<int> medians{x, y, z};
	if((int) medians.size() == 1 || medians == set<int>{a[2], a[3]}) {
		z = query(a[0], a[2], a[3]);
	}
	medians = set<int>{x, y, z};
	assert((int) medians.size() == 2);
	int B = *medians.begin();
	int C = *medians.rbegin();
	int cnt = 0;
	for(int r = 1; r <= 3; ++r) {
		for(int t = r + 1; t <= 3; ++t) {
			set<int> tmp{a[0], a[r], a[t]};
			if(tmp.count(B) && tmp.count(C)) {
				int A = a[0]+a[r]+a[t]-B-C;
				int D = a[0]+a[1]+a[2]+a[3] - A - B - C;
				int should_be = vector<int>{x, y, z}[cnt];
				if(should_be == C) {
					swap(B, C);
				}
				assert(B == should_be);
				return {A, B, C, D};
			}
			cnt++;
		}
	}
	assert(false);
}

vector<int> merge(vector<int> a, vector<int> b) {
	vector<int> ext = solve_four({a[0], a.back(), b[0], b.back()});
	vector<bool> order;
	for(vector<int> v : {a, b}) {
		for(int i = 0; i < 4; ++i) {
			for(int j = i + 1; j < 4; ++j) {
				if(ext[i] == v[0] && ext[j] == v.back()) {
					order.push_back(true); // increasing
				}
				if(ext[i] == v.back() && ext[j] == v[0]) {
					order.push_back(false); // decreasing
				}
			}
		}
	}
	assert((int) order.size() == 2);
	if(order[0] != order[1]) {
		reverse(b.begin(), b.end());
	}
	
	vector<int> total;
	
	auto pop_first = [&](vector<int>& v) {
		total.push_back(v[0]);
		v.erase(v.begin());
	};
	
	while(!a.empty() && !b.empty() && int(a.size()+b.size()) >= 3) {
		if(a.size() < b.size()) {
			swap(a, b);
		}
		int median = query(a[0], a[1], b[0]);
		if(median == a[0]) {
			pop_first(b);
		}
		else if(median == a[1]) {
			pop_first(a);
			pop_first(a);
		}
		else if(median == b[0]) {
			pop_first(a);
			pop_first(b);
		}
		else {
			assert(false);
		}
	}
	if((int) a.size() == 1 && (int) b.size() == 1) {
		int x = query(total.back(), a[0], b[0]);
		assert(x == a[0] || x == b[0]);
		if(x == a[0]) {
			pop_first(a);
		}
		else {
			pop_first(b);
		}
	}
	assert(a.empty() || b.empty());
	while(!a.empty()) {
		pop_first(a);
	}
	while(!b.empty()) {
		pop_first(b);
	}
	return total;
}

/*
void print_values(vector<int> indices) {
	vector<int> values;
	for(int i : indices) {
		values.push_back(hidden[i]);
		// cerr << hidden[i] << " ";
	}
	// cerr << endl;
	int inc = 0, dec = 0;
	for(int i = 1; i < (int) values.size(); ++i) {
		if(values[i] > values[i-1]) {
			inc++;
		}
		else {
			dec++;
		}
	}
	assert(inc == 0 || dec == 0);
}*/

void test_case() {
	// hidden.clear();
	// for(int i = 0; i < n; ++i) {
		// hidden.push_back(i);
	// }
	// random_shuffle(hidden.begin(), hidden.end());
	// for(int i = 0; i + 3 < n; ++i) {
		// vector<int> v = solve_four({i, i + 1, i + 2, i + 3});
		// debug() << imie(v);
	// }
	
	vector<vector<int>> parts;
	int memo_n = n;
	while(n % 4 != 0) {
		parts.push_back(solve_three({n - 1, n - 2, n - 3}));
		n -= 3;
	}
	// debug() << imie(n);
	while(n > 0) {
		parts.push_back(solve_four({n - 1, n - 2, n - 3, n - 4}));
		n -= 4;
	}
	assert(n == 0);
	n = memo_n;
	// for(int i = 0; i < n; i += 4) {
		// parts.push_back(solve_four({i, i + 1, i + 2, i + 3}));
	// }
	while((int) parts.size() >= 2) {
		// two shortest ones
		sort(parts.begin(), parts.end(), [&](const vector<int>& A, const vector<int>& B) {
			return A.size() < B.size();
		});
		vector<int> total = merge(parts[0], parts[1]);
		parts.erase(parts.begin());
		parts.erase(parts.begin());
		parts.push_back(total);
	}
	
	// vector<int> a = solve_four({0, 1, 2, 3});
	// vector<int> b = solve_four({4, 5, 6, 7});
	// vector<int> m = merge(a, b);
	// print_values(parts[0]);
	
	// debug() << imie(hidden);
	
	for(int i : parts[0]) {
		printf("%d ", i + 1);
	}
	puts("");
	fflush(stdout);
	int r;
	scanf("%d", &r);
	assert(r == 1);
}

int main() {
	// srand(4);
	// int T = 100;
	// scanf("%d", &T);
	int T;
	int Q;
	scanf("%d%d%d", &T, &n, &Q);
	for(int nr = 1; nr <= T; ++nr) {
		// printf("Case #%d: ", nr);
		test_case();
	}
	
	debug() << imie(operations);
}





// C++ program to implement dual pivot QuickSort
#include
using namespace std;

int partition(int* arr, int low, int high, int* lp);

void DualPivotQuickSort(int* arr, int low, int high)
{
if (low < high) { // lp means left pivot, and rp means right pivot. int lp, rp; rp = partition(arr, low, high, &lp); DualPivotQuickSort(arr, low, lp - 1); DualPivotQuickSort(arr, lp + 1, rp - 1); DualPivotQuickSort(arr, rp + 1, high); } } int partition(int* arr, int low, int high, int* lp) { if (arr[low] > arr[high])
swap(&arr[low], &arr[high]);

// p is the left pivot, and q is the right pivot.
int j = low + 1;
int g = high – 1, k = low + 1, p = arr[low], q = arr[high];
while (k <= g) { // if elements are less than the left pivot if (arr[k] < p) { swap(&arr[k], &arr[j]); j++; } // if elements are greater than or equal // to the right pivot else if (arr[k] >= q) {
while (arr[g] > q && k < g) g--; swap(&arr[k], &arr[g]); g--; if (arr[k] < p) { swap(&arr[k], &arr[j]); j++; } } k++; } j--; g++; // bring pivots to their appropriate positions. swap(&arr[low], &arr[j]); swap(&arr[high], &arr[g]); // returning the indices of the pivots. *lp = j; // because we cannot return two elements // from a function. return g; } // Driver code int main() { int arr[] = { 24, 8, 42, 75, 29, 77, 38, 57 }; DualPivotQuickSort(arr, 0, 7); cout << "Sorted array: "; for (int i = 0; i < 8; i++) cout << arr[i] << " "; cout << endl; } // This code is contributed by SHUBHAMSINGH10
