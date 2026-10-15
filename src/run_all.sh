#!/usr/bin/env bash
# Tai lap TOAN BO ket qua va file luan van tu 2 tep du lieu nghien cuu HeadView_Workload.csv va ItemView_Workload.csv.
# (ItemView_TrangThaiTruocDoiSoat.csv chi phuc vu mot kiem tra do vung cua BT2 duoc bao cao o Muc 4.2.1.)
# Dung: bash run_all.sh   (chay trong thu muc du an, can Python 3.10+ va Node 18+)
# Mo phong Muc 4.4 mat ~15 phut (200 lan lap + luoi 2x30 o). Chay nhanh de thu: SIM_R=20 SIM_RG=5 bash run_all.sh
set -euo pipefail
cd "$(dirname "$0")"
for f in HeadView_Workload.csv ItemView_Workload.csv ItemView_TrangThaiTruocDoiSoat.csv; do
  [ -f "$f" ] || { echo "Thieu $f — tai vao thu muc nay truoc."; exit 1; }
done
python3 -m pip install -q --break-system-packages -r requirements.txt 2>/dev/null \
  || python3 -m pip install -q -r requirements.txt
[ -d node_modules/docx ] || npm install --silent
echo "== 1/12 So lieu Chuong 1";             python3 ch1_stats.py      > /dev/null
echo "== 2/12 BT1 theo khau";                python3 bt1_pertask.py    > /dev/null
echo "== 3/12 BT1 dac ta mo hinh";           python3 bt1_models.py     > /dev/null
echo "== 4/12 Thien lech R2 / pseudo R2";    python3 metric_compare.py > /dev/null
echo "== 5/12 BT3 dieu kien bac nhat";       python3 bt3_form2.py      > /dev/null
echo "== 6/12 BT2 logistic + Hinh 4.1-4.4";  python3 ch4_bt12.py       > /dev/null
echo "== 7/12 BT3 chinh sach + Hinh 4.5-4.7";python3 ch4_bt3.py        > /dev/null
echo "== 8/12 Mo phong lien ky (Muc 4.4)";   python3 ch4_sim.py        > /dev/null
echo "== 9/12 Hinh 4.8-4.9";                python3 ch4_sim_figs.py   > /dev/null
echo "== 10/12 Gia bong / hoa von";          python3 ch5_triage.py     > /dev/null
echo "== 11/12 ICC + Phu luc A";             python3 ch4_icc_appx.py   > /dev/null
echo "== 12/12 Hinh 1.1, 1.2, 3.1";          python3 figs_ch1_ch3.py   > /dev/null
echo "== Bien soan luan van";                node build_all.js
echo "== SoT";                         python3 make_sot.py       > /dev/null
